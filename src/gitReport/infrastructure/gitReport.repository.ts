import { inject, injectable } from 'tsyringe'
import path from 'path'
import { EOL } from 'os'
import { Command } from '@core/infrastructure/command'
import { GitReportList } from '@gitReport/domain/gitReportList'
import { Logger } from '@core/infrastructure/logger'
import { CommitterInfo, GitReport } from '@gitReport/domain/gitReport'

@injectable()
export class GitReportRepository {
  constructor (
    @inject(Command) private readonly command: Command,
    @inject(Logger) private readonly logger: Logger
  ) {
  }

  async readGitReports (projectsPaths: string[], weeks: number): Promise<GitReportList> {
    if (projectsPaths.length === 0) {
      return new GitReportList([])
    }
    const reports = [] as GitReport[]
    for await (const report of this.readGitReportsGenerator(projectsPaths, weeks)) {
      reports.push(report)
    }
    return new GitReportList(reports)
  }

  async readGitProjects (directoryPath: string): Promise<string[]> {
    const absolutePath = path.resolve(directoryPath)
    const list = await this.command.run(`ls -dl ${absolutePath}/*/.git`)
    if (list.includes('no matches found')) {
      return []
    }
    return list.split('\n').map(line =>
      line.split(' ').slice(-1)[0].replace('/.git', '')
    ).filter(Boolean)
  }

  private async * readGitReportsGenerator (projectsPaths: string[], weeks: number): AsyncGenerator<GitReport> {
    let amountOfGitLogRead = 1
    for (const projectPath of projectsPaths) {
      try {
        const gitLog = await this.readGitLog(projectPath, weeks)
        this.logger.info(`(${amountOfGitLogRead}/${projectsPaths.length}) Read git log for ${projectPath}`)
        yield this.mapToDomain(gitLog, weeks, projectPath)
      } catch (e) {
        this.logger.error(`(${amountOfGitLogRead}/${projectsPaths.length}) 💥 Error reading git log for ${projectPath}. More info about the error below:`)
        this.logger.error(e.message)
      } finally {
        amountOfGitLogRead += 1
      }
    }
  }

  private mapToDomain (gitLog: string, weeks: number, projectPath: string): GitReport {
    const contributors = gitLog.split(EOL.concat(EOL)).filter(Boolean)
    return new GitReport({
      weeks,
      projects: [GitReportRepository.extractProjectName(projectPath)],
      committers: this.extractCommitters(contributors)
    })
  }

  private async readGitLog (projectPath: string, weeks: number): Promise<string> {
    const absolutePath = path.resolve(projectPath)
    await this.command.run(`git -C ${absolutePath} fetch && git -C ${absolutePath} pull`)
    return this.command.run(`git -C ${absolutePath} log --after="${weeks} weeks ago" --all --pretty=format:'%an | %ae' --shortstat`)
  }

  private extractCommitters (gitLogStats: string[]): CommitterInfo[] {
    const contributorsCounter = gitLogStats.reduce<Record<string, { stats: string[], totalCommits: number }>>(
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
    return Object.entries(contributorsCounter).map(([contributor, {
      totalCommits,
      stats
    }]) => ({
      ...GitReportRepository.extractContributorInfo(contributor),
      ...GitReportRepository.extractStats(stats),
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
      const filesChanged = GitReportRepository.parseStat(/\d* files? changed/, stat)
      const insertions = GitReportRepository.parseStat(/\d* insertions?/, stat)
      const deletions = GitReportRepository.parseStat(/\d* deletions?/, stat)
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
}
