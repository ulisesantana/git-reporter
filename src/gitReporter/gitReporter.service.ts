import { EOL } from 'os'
import { inject, injectable } from 'tsyringe'
import { GitReporterRepository } from './gitReporter.repository'
import faker from 'faker'
import path from 'path'
import { Logger } from '../logger'

export interface CommitterInfo {
  name: string
  email: string
  totalFilesChanged: number
  totalInsertions: number
  totalDeletions: number
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
    const contributors = this.gitLog.join(EOL).split(EOL.concat(EOL)).filter(Boolean)
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
      committers: report.committers.map(committer => ({
        ...committer,
        email: faker.internet.email(),
        name: faker.name.findName()
      }))
    }
  }

  private addGitLog (gitLog: string): void {
    this.gitLog.push(gitLog)
  }

  private async * readGitLogs (projectsPaths: string[], weeks: number) {
    let amountOfGitLogRead = 1
    for (const projectPath of projectsPaths) {
      const gitLog = await this.repository.readGitLog(projectPath, weeks)
      this.log.info(`(${amountOfGitLogRead}/${projectsPaths.length}) Read git log for ${projectPath}`)
      amountOfGitLogRead += 1
      yield gitLog
    }
  }

  private extractCommitters (gitLogStats: string[]): CommitterInfo[] {
    const contributorsCounter = gitLogStats.reduce<Record<string, {stats: string[], totalCommits: number}>>(
      (contributorsCounter, gitLogStat) => {
        const [contributor, stats] = gitLogStat.split(EOL)
        return {
          ...contributorsCounter,
          [contributor]: {
            stats: [...(contributorsCounter[contributor]?.stats || []), stats],
            totalCommits: (contributorsCounter[contributor]?.totalCommits || 0) + 1
          }
        }
      }, {})
    return Object.entries(contributorsCounter).map(([contributor, { totalCommits, stats }]) => ({
      ...GitReporterService.extractContributorInfo(contributor),
      ...GitReporterService.extractStats(stats),
      totalCommits
    }))
  }

  private static extractContributorInfo (contributor: string): Pick<CommitterInfo, 'name' | 'email'> {
    const [name, email] = contributor.split('|')
    return {
      name: String(name).trim(),
      email: String(email).trim()
    }
  }

  private static extractStats (stats: string[]): Pick<CommitterInfo, 'totalFilesChanged' | 'totalInsertions' | 'totalDeletions'> {
    return stats.reduce((acc, stat) => {
      const filesChanged = GitReporterService.parseStat(/\d* files? changed/, stat)
      const insertions = GitReporterService.parseStat(/\d* insertions?/, stat)
      const deletions = GitReporterService.parseStat(/\d* deletions?/, stat)
      return {
        totalFilesChanged: filesChanged + acc.totalFilesChanged,
        totalInsertions: insertions + acc.totalInsertions,
        totalDeletions: deletions + acc.totalDeletions
      }
    }, {
      totalFilesChanged: 0,
      totalInsertions: 0,
      totalDeletions: 0
    })
  }

  private static parseStat (regExp: RegExp, stat: string): number {
    const extractedStat = regExp.exec(stat)
    if (extractedStat) {
      const [value] = /\d*/.exec(extractedStat[0])
      return Number(value)
    }
    return 0
  }

  private static extractProjectName (projectPath: string): string {
    const absolutePath = path.resolve(projectPath)
    return absolutePath.slice(absolutePath.lastIndexOf('/') + 1)
  }

  private static sortCommittersByTotalCommitsDesc (committers: CommitterInfo[]): CommitterInfo[] {
    return committers.sort((a, b) => {
      return b.totalCommits - a.totalCommits || a.name.localeCompare(b.name)
    })
  }
}
