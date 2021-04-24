import { EOL } from 'os'
import { inject, injectable } from 'tsyringe'
import { GitReporterRepository } from './gitReporter.repository'
import faker from 'faker'

export interface CommitterInfo {
  name: string
  email: string
  totalCommits: number
}

export interface GitReport {
  totalCommits: number
  committers: CommitterInfo[]
}

@injectable()
export class GitReporterService {
  private gitLog: string[] = []

  constructor (
    @inject(GitReporterRepository) private readonly repository: GitReporterRepository
  ) {}

  async generateReport (projectsPaths: string[], weeks: number = 4): Promise<GitReport> {
    for await (const gitLog of this.readGitLogs(projectsPaths, weeks)) {
      this.addGitLog(gitLog)
    }
    const contributors = this.gitLog.join(EOL).split(EOL).filter(line => line.includes('Author: '))
    return {
      totalCommits: contributors.length,
      committers: GitReporterService.sortCommittersByTotalCommitsDesc(this.extractCommitters(contributors))
    }
  }

  async generateAnonymousReport (projectsPaths: string[], weeks: number = 4): Promise<GitReport> {
    const report = await this.generateReport(projectsPaths, weeks)
    return {
      totalCommits: report.totalCommits,
      committers: report.committers.map(({ totalCommits }) => ({
        email: faker.internet.email(),
        name: faker.name.findName(),
        totalCommits
      }))
    }
  }

  private addGitLog (gitLog: string): void {
    this.gitLog.push(gitLog)
  }

  private async * readGitLogs (projectsPaths: string[], weeks: number) {
    for (const projectPath of projectsPaths) {
      const gitLog = await this.repository.readGitLog(projectPath, weeks)
      yield gitLog
    }
  }

  private extractCommitters (contributors: string[]): CommitterInfo[] {
    const contributorsCounter = contributors.reduce<Record<string, number>>((contributorsCounter, contributor) => ({
      ...contributorsCounter,
      [contributor]: (contributorsCounter[contributor] || 0) + 1
    }), {})
    return Object.entries(contributorsCounter).map(([contributor, totalCommits]) => ({
      ...GitReporterService.extractContributorInfo(contributor),
      totalCommits
    }))
  }

  private static extractContributorInfo (contributor: string): Omit<CommitterInfo, 'totalCommits'> {
    const [name, email] = contributor.split('<')
    return {
      name: name.replace('Author: ', '').trim(),
      email: email.replace('>', '').trim()
    }
  }

  private static sortCommittersByTotalCommitsDesc (committers: CommitterInfo[]): CommitterInfo[] {
    return committers.sort((a, b) => {
      if (a.totalCommits > b.totalCommits) return -1
      if (a.totalCommits < b.totalCommits) return 1
      return 0
    })
  }
}
