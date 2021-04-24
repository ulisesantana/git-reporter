import { inject, injectable } from 'tsyringe'
import { GitReport, GitReporterService } from './gitReporter.service'
import { EOL } from 'os'
import { Notifier } from '../notifier'
import { Logger } from '../logger'
import path from 'path'

interface GitReporterOptions {
  anonymize: boolean
  projects: string[]
  slackUrl: string
  weeks: number
}

@injectable()
export class GitReporterController {
  constructor (
    @inject(GitReporterService) private readonly service: GitReporterService,
    @inject(Notifier) private readonly notifier: Notifier,
    @inject(Logger) private readonly log: Logger
  ) {}

  async exec ({
    anonymize,
    projects,
    weeks,
    slackUrl
  }: GitReporterOptions) {
    const report = anonymize
      ? await this.service.generateAnonymousReport(projects, weeks)
      : await this.service.generateReport(projects, weeks)
    const reportOutput = GitReporterController.generateReportOutput(weeks, projects, report)
    this.log.info(reportOutput)
    if (slackUrl) {
      await this.notifier.publishOnSlack(slackUrl, reportOutput)
      this.log.info('Report published on Slack.')
    }
  }

  private static generateReportOutput (weeks: number, projectsPaths: string[], report: GitReport): string {
    return `
Report for: 
${projectsPaths.map(
    projectPath => `    ${GitReporterController.extractProjectName(projectPath)}`
  ).join(EOL)
}

Total commits in the last ${weeks} weeks: ${report.totalCommits}
Contributions by author:
${report.committers.map(({
      name,
      email,
      totalCommits
    }) => `    ${name} (${email}): ${totalCommits}`).join(EOL)}
`
  }

  private static extractProjectName (projectPath: string): string {
    const absolutePath = path.resolve(projectPath)
    return absolutePath.slice(absolutePath.lastIndexOf('/') + 1)
  }
}
