import { inject, injectable } from 'tsyringe'
import { GitReport, GitReporterService } from './gitReporter.service'
import { EOL } from 'os'
import { Notifier } from '../notifier'
import { Logger } from '../logger'

interface GitReporterOptions {
  allInDirectory: string
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
    allInDirectory,
    anonymize,
    projects,
    weeks,
    slackUrl
  }: GitReporterOptions) {
    let report: GitReport
    if (allInDirectory) {
      report = anonymize
        ? await this.service.generateAnonymousReportForAllProjectsInADirectory(allInDirectory, weeks)
        : await this.service.generateReportForAllProjectsInADirectory(allInDirectory, weeks)
    } else {
      report = anonymize
        ? await this.service.generateAnonymousReport(projects, weeks)
        : await this.service.generateReport(projects, weeks)
    }
    const reportOutput = GitReporterController.generateReportOutput(report)
    this.log.info(reportOutput)
    if (slackUrl) {
      await this.notifier.publishOnSlack(slackUrl, reportOutput)
      this.log.info('Report published on Slack.')
    }
  }

  private static generateReportOutput (report: GitReport): string {
    return `
Report for: 
${report.projects.map(project => `    ${project}`).join(EOL)}

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
}
