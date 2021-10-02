import {inject, singleton} from 'tsyringe'
import {cli} from 'cli-ux'
import {Logger} from '../../../core/infrastructure/logger'
import {green, red, underline} from 'colorette'
import path from 'path'
import {EOL} from 'os'
import {GitReport} from '../../domain/git-report'
import version from '../../../version'

export interface ProgressBar {
  start(total: number, initial: number): void
  increment(value?: number): void
  stop(): void
  value: number
  total: number
}

@singleton()
export class GitReportPrinter {
  constructor(@inject(Logger) private logger: Logger) {}

  info(...text: string[]): void {
    this.logger.info(...text)
  }

  error(...text: string[]): void {
    this.logger.error(...text)
  }

  generateProgressBar(conceptToProgressAbout: string): ProgressBar {
    return cli.progress({
      format: `PROGRESS | ${green('{bar}')} | ${green('{value}/{total}')} ${conceptToProgressAbout}.`,
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
    }) as ProgressBar
  }

  printInit(): void {
    this.logger.info(underline(`Initializing git reporter ${version}${EOL}`))
  }

  printStartFetchingDirectory(pathToDirectory: string): void {
    this.logger.info(`🔍 Starting to fetch git logs for projects in directory ${
      path.resolve(pathToDirectory)
    }.${EOL}`)
  }

  printStartFetchingProjects(projectsPath: string[]): void {
    const projectsAbsolutePaths = projectsPath.map(project => path.resolve(project))
    this.logger.info(`🔍 Starting to fetch git logs for: ${EOL}  - ${
      projectsAbsolutePaths.map(GitReportPrinter.extractProjectName).join(`${EOL}  - `)
    }${EOL}`)
  }

  printFailedReports(failedReports: GitReport[]): void {
    if (failedReports.length > 0) {
      this.logger.error(`${EOL}🚨 The following projects failed to get git log:`)
      for (const {projects} of failedReports) {
        this.logger.error(`  - ${projects.map(red).join(`${EOL}  - `)}`)
      }
    }
  }

  private static extractProjectName(absoluteProjectPath: string): string {
    return absoluteProjectPath.slice(absoluteProjectPath.lastIndexOf('/') + 1)
  }
}
