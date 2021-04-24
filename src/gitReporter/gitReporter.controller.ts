import { inject, injectable } from 'tsyringe'
import { GitReport, GitReporterService } from './gitReporter.service'
import { EOL } from 'os'
import { request } from 'undici'
import { RequestOptions } from 'undici/types/client'
import faker from 'faker'

interface GitReporterOptions {
  anonymize: boolean
  projects: string[]
  slackUrl: string
  weeks: number
}

@injectable()
export class GitReporterController {
  constructor (
    @inject(GitReporterService) private readonly service: GitReporterService
  ) {}

  async exec ({
    anonymize,
    projects,
    weeks,
    slackUrl
  }: GitReporterOptions) {
    const report = await this.service.exec(projects, weeks)
    const reportOutput = anonymize
      ? GitReporterController.generateAnonymousReportOutput(weeks, projects, report)
      : GitReporterController.generateReportOutput(weeks, projects, report)
    GitReporterController.printReport(reportOutput)
    if (slackUrl) {
      await GitReporterController.publishOnSlack(slackUrl, reportOutput)
      console.log('Report published on Slack.')
    }
  }

  private static printReport (report: string) {
    console.log(report)
  }

  private static async publishOnSlack (slackUrl: string, reportOutput: string): Promise<void> {
    try {
      await request(slackUrl, {
        method: 'POST',
        body: JSON.stringify({ text: reportOutput }, null, 2)
      } as RequestOptions)
    } catch (err) {
      console.error('Error publishing on Slack')
      console.error(err.toString())
    }
  }

  private static generateAnonymousReportOutput (weeks: number, projectsPaths: string[], report: GitReport): string {
    return GitReporterController.generateReportOutput(weeks, projectsPaths, {
      totalCommits: report.totalCommits,
      committers: report.committers.map(({ totalCommits }) => ({
        email: faker.internet.email(),
        name: faker.name.findName(),
        totalCommits
      }))
    })
  }

  private static generateReportOutput (weeks: number, projectsPaths: string[], report: GitReport): string {
    return `
Report for: 
${projectsPaths.map(path => `    ${path.slice(path.lastIndexOf('/') + 1)}`).join(EOL)}

Total commits in the last ${weeks} weeks: ${report.totalCommits}
Contributions by author:
${report.committers.map(({
      name,
      email,
      totalCommits
    }) => `   ${name} (${email}): ${totalCommits}`).join(EOL)}
`
  }
}
