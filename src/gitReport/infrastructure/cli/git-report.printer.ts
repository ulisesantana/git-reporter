import {singleton} from 'tsyringe'
import {cli} from 'cli-ux'
import {Logger} from '../../../core/infrastructure/logger'
import {green, underline} from 'colorette'
import path from 'path'
import {EOL} from 'os'
import {GitReport} from '../../domain/git-report'
import version from '../../../version'

export interface ProgressBar {
  start(total: number, initial: number): void
  update(value: number): void
  increment(value?: number): void
  stop(): void
}

@singleton()
export class GitReportPrinter extends Logger {
  printInit(): void {
    this.info(underline(`Initializing git reporter ${version}${EOL}`))
  }

  generateProgressBar(conceptToProgressAbout: string): ProgressBar {
    return cli.progress({
      format: `PROGRESS | ${green('{bar}')} | ${green('{value}/{total}')} ${conceptToProgressAbout}.`,
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
    }) as ProgressBar
  }

  printStartFetchingDirectory(pathToDirectory: string): void {
    this.info(`🔍 Starting to fetch git logs for projects in directory ${
      path.resolve(pathToDirectory)
    }.${EOL}`)
  }

  printStartFetchingProjects(projectsPath: string[]): void {
    const projectsAbsolutePaths = projectsPath.map(project => path.resolve(project))
    this.info(`🔍 Starting to fetch git logs for: ${EOL}  - ${
      projectsAbsolutePaths.map(GitReportPrinter.extractProjectName).join(`${EOL}  - `)
    }${EOL}`)
  }

  printFailedReports(failedReports: GitReport[]): void {
    if (failedReports.length > 0) {
      this.error(`${EOL}🚨 The following projects failed to get git log:`)
      for (const {projects} of failedReports) {
        this.error(`  - ${projects.join(`${EOL}  - `)}${EOL}`)
      }
    }
  }

  private static extractProjectName(absoluteProjectPath: string): string {
    return absoluteProjectPath.slice(absoluteProjectPath.lastIndexOf('/') + 1)
  }
}
