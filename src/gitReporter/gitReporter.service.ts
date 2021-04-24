import { EOL } from 'os'
import { inject, injectable } from 'tsyringe'
import { GitReporterRepository } from './gitReporter.repository'

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

  async exec (projectPaths: string[], period: string = '4 weeks ago'): Promise<GitReport> {
    for await (const gitLog of this.readGitLogs(projectPaths, period)) {
      this.addGitLog(gitLog)
    }
    const contributors = this.gitLog.join(EOL).split(EOL).filter(line => line.includes('Author: '))
    return {
      totalCommits: contributors.length,
      committers: GitReporterService.sortCommittersByTotalCommitsDesc(this.extractCommitters(contributors))
    }
  }

  private addGitLog (gitLog: string): void {
    this.gitLog.push(gitLog)
  }

  private async * readGitLogs (projectPaths: string[], period: string) {
    for (const projectPath of projectPaths) {
      const gitLog = await this.repository.readGitLog(projectPath, period)
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
