import {container, inject, injectable} from 'tsyringe'
import path from 'path'
import {GenerateAnonymizeReportForProjectsInDirectoryUseCase} from '../application/cases/generate-anonymize-report-for-projects-in-directory.case'
import {GenerateAnonymizeReportUseCase} from '../application/cases/generate-anonymize-report.case'
import {GenerateReportUseCase} from '../application/cases/generate-report.case'
import {GenerateReportForProjectsInDirectoryUseCase} from '../application/cases/generate-report-for-projects-in-directory.case'
import {Notifier} from '../../core/infrastructure/notifier'
import {GitReportPrinter} from './cli/git-report.printer'
import {GenerateUpdatedReportCase} from '../application/cases/generate-updated-report.case'
import {EOL} from 'os'

interface GitReporterOptions {
  anonymize: boolean
  directory: string
  forceUpdate: boolean
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

  async exec(options: GitReporterOptions): Promise<void> {
    const report = options.directory ?
      await this.executeReportForDirectory(options) :
      await this.executeReportForMultipleProjects(options)
    await this.printAndNotifyReport(report.toString({verbose: options.verbose}), options)
  }

  private async executeReportForDirectory({
    directory,
    anonymize,
    weeks,
    forceUpdate,
  }: GitReporterOptions) {
    this.printer.printStartFetchingDirectory(directory)
    return anonymize ?
      container.resolve(GenerateAnonymizeReportForProjectsInDirectoryUseCase).exec({
        directoryPath: directory,
        weeks,
        forceUpdate,
      }) :
      container.resolve(GenerateReportForProjectsInDirectoryUseCase).exec({
        directoryPath: directory,
        weeks,
        forceUpdate,
      })
  }

  private async executeReportForMultipleProjects({projects, anonymize, weeks, forceUpdate}: GitReporterOptions) {
    this.printer.printStartFetchingProjects(projects)
    const projectsAbsolutePaths = projects.map(project => path.resolve(project))
    if (anonymize) {
      return container.resolve(GenerateAnonymizeReportUseCase).exec({
        projectsPaths: projectsAbsolutePaths,
        weeks,
        forceUpdate,
      })
    }
    if (forceUpdate) {
      return container.resolve(GenerateUpdatedReportCase).exec({
        projectsPaths: projectsAbsolutePaths,
        weeks,
      })
    }
    return container.resolve(GenerateReportUseCase).exec({
      projectsPaths: projectsAbsolutePaths,
      weeks,
    })
  }

  private async printAndNotifyReport(report: string, {slackUrl, forceUpdate}: GitReporterOptions) {
    if (forceUpdate) {
      this.printer.info(report)
      await this.notifyReport(slackUrl, report)
    } else {
      const reportWithWarning = GitReportController.concatReportWithoutUpdateWarning(report)
      this.printer.info(reportWithWarning)
      await this.notifyReport(slackUrl, reportWithWarning)
    }
  }

  private async notifyReport(slackUrl: string, reportOutput: string) {
    if (slackUrl) {
      await this.notifier.publishOnSlack(slackUrl, reportOutput)
      this.printer.info('Report published on Slack.')
    }
  }

  private static concatReportWithoutUpdateWarning(report: string) {
    return report.concat(`${EOL}${EOL}⚠️  Report generated without updating git projects. For generating a report updating projects use --forceUpdate (-f) option.`)
  }
}
