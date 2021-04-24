import { EOL } from 'os'
import { inject, injectable } from 'tsyringe'
import { GitReporterRepository } from './gitReporter.repository'
import faker from 'faker'
import path from 'path'
import { Logger } from '../logger'

export interface CommitterInfo {
  name: string
  email: string
  totalCommits: number
}

export interface GitReport {
  weeks: number
  projects: string[]
  totalCommits: number
  committers: CommitterInfo[]
}

@injectable()
export class GitReporterService {
  private gitLog: string[] = []

  constructor (
    @inject(GitReporterRepository) private readonly repository: GitReporterRepository,
    @inject(Logger) private readonly log: Logger
  ) {}

  async generateReportForAllProjectsInADirectory (directoryPath: string, weeks: number): Promise<GitReport> {
    const projectPaths = await this.repository.readGitProjects(directoryPath)
    return this.generateReport(projectPaths, weeks)
  }

  async generateAnonymousReportForAllProjectsInADirectory (directoryPath: string, weeks: number): Promise<GitReport> {
    const projectPaths = await this.repository.readGitProjects(directoryPath)
    return this.generateAnonymousReport(projectPaths, weeks)
  }

  async generateReport (projectsPaths: string[], weeks: number): Promise<GitReport> {
    for await (const gitLog of this.readGitLogs(projectsPaths, weeks)) {
      this.addGitLog(gitLog)
    }
    const contributors = this.gitLog.join(EOL).split(EOL).filter(line => line.includes('Author: '))
    return {
      weeks,
      projects: projectsPaths.map(GitReporterService.extractProjectName),
      totalCommits: contributors.length,
      committers: GitReporterService.sortCommittersByTotalCommitsDesc(this.extractCommitters(contributors))
    }
  }

  async generateAnonymousReport (projectsPaths: string[], weeks: number): Promise<GitReport> {
    const report = await this.generateReport(projectsPaths, weeks)
    return {
      weeks,
      projects: projectsPaths.map(
        projectPath => `    ${GitReporterService.extractProjectName(projectPath)}`
      ),
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
    let amountOfGitLogRead = 1
    for (const projectPath of projectsPaths) {
      this.log.info(`(${amountOfGitLogRead}/${projectsPaths.length}) Reading git log for ${projectPath}`)
      const gitLog = await this.repository.readGitLog(projectPath, weeks)
      amountOfGitLogRead += 1
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

  private static extractProjectName (projectPath: string): string {
    const absolutePath = path.resolve(projectPath)
    return absolutePath.slice(absolutePath.lastIndexOf('/') + 1)
  }

  private static sortCommittersByTotalCommitsDesc (committers: CommitterInfo[]): CommitterInfo[] {
    return committers.sort((a, b) => {
      if (a.totalCommits > b.totalCommits) return -1
      if (a.totalCommits < b.totalCommits) return 1
      return 0
    })
  }
}
