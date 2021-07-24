import { inject, injectable } from 'tsyringe'
import { GitReportRepository } from '../infrastructure/gitReport.repository'
import { AccumulatedGitReport, GitReport, GitReporter } from './gitReport'

@injectable()
export class GitReportService {
  constructor (
    @inject(GitReportRepository) private readonly repository: GitReportRepository
  ) {}

  async generateReportForAllProjectsInADirectory (directoryPath: string, weeks: number): Promise<AccumulatedGitReport> {
    const projectPaths = await this.repository.readGitProjects(directoryPath)
    return this.generateReport(projectPaths, weeks)
  }

  async generateAnonymousReportForAllProjectsInADirectory (directoryPath: string, weeks: number): Promise<AccumulatedGitReport> {
    const projectPaths = await this.repository.readGitProjects(directoryPath)
    return this.generateAnonymousReport(projectPaths, weeks)
  }

  async generateReport (projectsPaths: string[], weeks: number): Promise<AccumulatedGitReport> {
    const reports = [] as GitReport[]
    for await (const report of this.repository.readGitReports(projectsPaths, weeks)) {
      reports.push(report)
    }
    return GitReporter.generateAccumulatedGitReport(reports)
  }

  async generateAnonymousReport (projectsPaths: string[], weeks: number): Promise<AccumulatedGitReport> {
    const report = await this.generateReport(projectsPaths, weeks)
    return GitReporter.anonymizeAccumulatedGitReport(report)
  }
}
