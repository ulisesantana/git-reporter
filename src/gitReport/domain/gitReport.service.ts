import { inject, injectable } from 'tsyringe'
import { GitReportRepository } from '../infrastructure/gitReport.repository'
import { GitReport } from './gitReport'

@injectable()
export class GitReportService {
  constructor (
    @inject(GitReportRepository) private readonly repository: GitReportRepository
  ) {}

  async generateReportForAllProjectsInADirectory (directoryPath: string, weeks: number): Promise<GitReport> {
    const projectPaths = await this.repository.readGitProjects(directoryPath)
    return this.generateReport(projectPaths, weeks)
  }

  async generateAnonymousReportForAllProjectsInADirectory (directoryPath: string, weeks: number): Promise<GitReport> {
    const projectPaths = await this.repository.readGitProjects(directoryPath)
    return this.generateAnonymousReport(projectPaths, weeks)
  }

  async generateReport (projectsPaths: string[], weeks: number): Promise<GitReport> {
    const reports = await this.repository.readGitReports(projectsPaths, weeks)
    return reports.mergeReports()
  }

  async generateAnonymousReport (projectsPaths: string[], weeks: number): Promise<GitReport> {
    const report = await this.generateReport(projectsPaths, weeks)
    return report.anonymize()
  }
}
