import { inject, injectable } from 'tsyringe'
import path from 'path'
import { Command } from '../../core/infrastructure/command'
import { handleError } from '../../core/domain/error'
import { Logger } from '../../core/infrastructure/logger'
import { GitReportList } from '../domain/gitReportList'
import { GitReport } from '../domain/gitReport'
import { GitReportRepository } from '../application/gitReport.repository'
import { GitReportMapper } from './gitReport.mapper'
import { EOL } from 'os'

@injectable()
export class GitReportCommandRepository implements GitReportRepository {
  constructor (
    @inject(Command) private readonly command: Command,
    @inject(Logger) private readonly logger: Logger
  ) {}

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
    return list.split(EOL).map(line =>
      line.split(' ').slice(-1)[0].replace('/.git', '')
    ).filter(Boolean)
  }

  private async * readGitReportsGenerator (projectsPaths: string[], weeks: number): AsyncGenerator<GitReport> {
    let amountOfGitLogRead = 1
    for (const projectPath of projectsPaths) {
      try {
        const gitLog = await this.readGitLog(projectPath, weeks)
        this.logger.info(`(${amountOfGitLogRead}/${projectsPaths.length}) Read git log for ${projectPath}`)
        yield GitReportMapper.toDomain(gitLog, weeks, projectPath)
      } catch (err) {
        this.logger.error(`(${amountOfGitLogRead}/${projectsPaths.length}) 💥 Error reading git log for ${projectPath}. More info about the error below:`)
        handleError(err, this.logger.error)
      } finally {
        amountOfGitLogRead += 1
      }
    }
  }

  private async readGitLog (projectPath: string, weeks: number): Promise<string> {
    const absolutePath = path.resolve(projectPath)
    await this.command.run(`git -C ${absolutePath} fetch && git -C ${absolutePath} pull`)
    return this.command.run(`git -C ${absolutePath} log --after="${weeks} weeks ago" --all --pretty=format:'%an | %ae' --shortstat`)
  }
}
