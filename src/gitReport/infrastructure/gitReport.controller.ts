import { inject, injectable } from 'tsyringe'
import { GitReportService } from '../domain/gitReport.service'
import { EOL } from 'os'
import { Notifier } from '../../notifier'
import { Logger } from '../../logger'
import { AccumulatedGitReport } from '../domain/gitReport'

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
    @inject(GitReportService) private readonly service: GitReportService,
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
    let report: AccumulatedGitReport
    if (allInDirectory) {
      report = anonymize
        ? await this.service.generateAnonymousReportForAllProjectsInADirectory(allInDirectory, weeks)
        : await this.service.generateReportForAllProjectsInADirectory(allInDirectory, weeks)
    } else {
      report = anonymize
        ? await this.service.generateAnonymousReport(projects, weeks)
        : await this.service.generateReport(projects, weeks)
    }
    const reportOutput = GitReportController.generateReportOutput(report)
    this.log.info(reportOutput)
    if (slackUrl) {
      await this.notifier.publishOnSlack(slackUrl, reportOutput)
      this.log.info('Report published on Slack.')
    }
  }

  private static generateReportOutput (report: AccumulatedGitReport): string {
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
