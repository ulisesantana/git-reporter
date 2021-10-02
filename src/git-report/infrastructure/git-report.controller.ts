import {container, inject, injectable} from 'tsyringe'
import path from 'path'
import {GenerateAnonymizeReportForProjectsInDirectoryUseCase} from '../application/cases/generate-anonymize-report-for-projects-in-directory.case'
import {GenerateAnonymizeReportUseCase} from '../application/cases/generate-anonymize-report.case'
import {GenerateReportUseCase} from '../application/cases/generate-report.case'
import {GenerateReportForProjectsInDirectoryUseCase} from '../application/cases/generate-report-for-projects-in-directory.case'
import {Notifier} from '../../core/infrastructure/notifier'
import {GitReportPrinter} from './cli/git-report.printer'

interface GitReporterOptions {
  directory: string
  anonymize: boolean
  projects: string[]
  slackUrl: string
  verbose: boolean
  weeks: number
}

@injectable()
export class GitReportController {
  constructor(
    @inject(Notifier) private readonly notifier: Notifier,
    @inject(GitReportPrinter) private readonly printer: GitReportPrinter,
  ) {}

  async exec({
    directory,
    anonymize,
    projects,
    slackUrl,
    verbose,
    weeks,
  }: GitReporterOptions): Promise<void> {
    const report = directory ?
      await this.executeReportForDirectory(directory, anonymize, weeks) :
      await this.executeReportForMultipleProjects(projects, anonymize, weeks)
    await this.printAndNotifyReport(report.toString({verbose}), slackUrl)
  }

  private async executeReportForDirectory(allInDirectory: string, anonymize: boolean, weeks: number) {
    this.printer.printStartFetchingDirectory(allInDirectory)
    return anonymize ?
      container.resolve(GenerateAnonymizeReportForProjectsInDirectoryUseCase).exec({
        directoryPath: allInDirectory,
        weeks,
      }) :
      container.resolve(GenerateReportForProjectsInDirectoryUseCase).exec({
        directoryPath: allInDirectory,
        weeks,
      })
  }

  private async executeReportForMultipleProjects(projects: string[], anonymize: boolean, weeks: number) {
    this.printer.printStartFetchingProjects(projects)
    const projectsAbsolutePaths = projects.map(project => path.resolve(project))
    return anonymize ?
      container.resolve(GenerateAnonymizeReportUseCase).exec({
        projectsPaths: projectsAbsolutePaths,
        weeks,
      }) :
      container.resolve(GenerateReportUseCase).exec({
        projectsPaths: projectsAbsolutePaths,
        weeks,
      })
  }

  private async printAndNotifyReport(report: string, slackUrl: string) {
    this.printer.info(report)
    await this.notifyReport(slackUrl, report)
  }

  private async notifyReport(slackUrl: string, reportOutput: string) {
    if (slackUrl) {
      await this.notifier.publishOnSlack(slackUrl, reportOutput)
      this.printer.info('Report published on Slack.')
    }
  }
}
