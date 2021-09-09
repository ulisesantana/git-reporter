import { inject, injectable } from 'tsyringe'
import { GitReportRepository } from '@gitReport/domain/gitReport.repository'
import { UseCase } from '@core/domain/useCase'
import { GitReport } from '@gitReport/domain/gitReport'
import { GitReportCommandRepository } from '@gitReport/infrastructure/gitReport.command.repository'

export interface GenerateReportInput {
  /**
   * List of directory paths where the projects to be reported are stored
   */
  readonly projectsPaths: string[]
  /**
   * Amount of last weeks to be reported
   */
  readonly weeks: number
}

@injectable()
export class GenerateReportUseCase implements UseCase<GenerateReportInput, Promise<GitReport>> {
  constructor (@inject(GitReportCommandRepository) private repository: GitReportRepository) {}

  async exec ({ projectsPaths, weeks }: GenerateReportInput): Promise<GitReport> {
    const reports = await this.repository.readGitReports(projectsPaths, weeks)
    return reports.mergeReports()
  }
}
