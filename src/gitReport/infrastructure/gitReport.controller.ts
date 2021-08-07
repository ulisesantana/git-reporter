import { container, inject, injectable } from 'tsyringe'
import { EOL } from 'os'
import { Notifier } from '../../notifier'
import { Logger } from '../../logger'
import { GitReport } from '../domain/gitReport'
import path from 'path'
import { GenerateAnonymizeReportForProjectsInDirectoryUseCase } from '../domain/cases/generateAnonymizeReportForProjectsInDirectory'
import { GenerateReportForProjectsInDirectoryUseCase } from '../domain/cases/generateReportForProjectsInDirectory'
import { GenerateAnonymizeReportUseCase } from '../domain/cases/generateAnonymizeReport'
import { GenerateReportUseCase } from '../domain/cases/generateReport'

interface GitReporterOptions {
  allInDirectory: string
  anonymize: boolean
  projects: string[]
  slackUrl: string
  weeks: number
}

@injectable()
export class GitReportController {
  constructor (
    @inject(Notifier) private readonly notifier: Notifier,
    @inject(Logger) private readonly logger: Logger
  ) {}

  async exec ({
    allInDirectory,
    anonymize,
    projects,
    weeks,
    slackUrl
  }: GitReporterOptions) {
    if (allInDirectory) {
      const report = await this.executeReportForDirectory(allInDirectory, anonymize, weeks)
      await this.printAndNotifyReport(report, slackUrl)
    } else {
      const report = await this.executeReportForMultipleProjects(projects, anonymize, weeks)
      await this.printAndNotifyReport(report, slackUrl)
    }
  }

  private async executeReportForDirectory (allInDirectory: string, anonymize: boolean, weeks: number) {
    this.logger.info(`🔍 Starting to fetch git logs for projects in directory ${
      path.resolve(allInDirectory)
    }.${EOL}`)
    return anonymize
      ? await container.resolve(GenerateAnonymizeReportForProjectsInDirectoryUseCase).exec({
        directoryPath: allInDirectory,
        weeks
      })
      : await container.resolve(GenerateReportForProjectsInDirectoryUseCase).exec({
        directoryPath: allInDirectory,
        weeks
      })
  }

  private async executeReportForMultipleProjects (projects: string[], anonymize: boolean, weeks: number) {
    const projectsAbsolutePaths = projects.map(project => path.resolve(project))
    this.logger.info(`🔍 Starting to fetch git logs for: ${EOL}  - ${
      projectsAbsolutePaths.map(GitReportController.extractProjectName).join(`${EOL}  - `)
    }${EOL}`)
    return anonymize
      ? await container.resolve(GenerateAnonymizeReportUseCase).exec({
        projectsPaths: projectsAbsolutePaths,
        weeks
      })
      : await container.resolve(GenerateReportUseCase).exec({
        projectsPaths: projectsAbsolutePaths,
        weeks
      })
  }

  private async printAndNotifyReport (report: Omit<GitReport, 'project'> & { projects: string[] }, slackUrl: string) {
    const reportOutput = GitReportController.generateReportOutput(report)
    this.logger.info(reportOutput)
    await this.notifyReport(slackUrl, reportOutput)
  }

  private async notifyReport (slackUrl: string, reportOutput: string) {
    if (slackUrl) {
      await this.notifier.publishOnSlack(slackUrl, reportOutput)
      this.logger.info('Report published on Slack.')
    }
  }

  private static generateReportOutput (report: GitReport): string {
    if (report.projects.length === 0) {
      return '⚠️  There is no git projects to report.'
    }
    return `
Report for: 
${report.projects.map(project => `  - ${project}`).join(EOL)}

Total commits in the last ${report.weeks} weeks: ${report.totalCommits}
Contributions by author:
${report.committers.map(({
      name,
      email,
      totalCommits,
      totalFilesChanged,
      totalInsertions,
      totalDeletions
    }) => `${EOL}    ${name} (${email}):
      Commits: ${totalCommits}
      Files changed: ${totalFilesChanged}
      Insertions: ${totalInsertions}
      Deletions: ${totalDeletions}`).join(EOL)}
`
  }

  private static extractProjectName (absoluteProjectPath: string): string {
    return absoluteProjectPath.slice(absoluteProjectPath.lastIndexOf('/') + 1)
  }
}
