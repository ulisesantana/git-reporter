import { inject, injectable } from 'tsyringe'
import { UseCase } from '@core/domain/useCase'
import { GenerateReportInput, GenerateReportUseCase } from '@gitReport/application/cases/generateReport.case'
import { GitReport } from '@gitReport/domain/gitReport'
import { GitReportRepository } from '@gitReport/infrastructure/gitReport.repository'

@injectable()
export class GenerateAnonymizeReportUseCase implements UseCase<GenerateReportInput, Promise<GitReport>> {
  constructor (@inject(GitReportRepository) private repository: GitReportRepository) {}

  async exec (input: GenerateReportInput): Promise<GitReport> {
    const report = await new GenerateReportUseCase(this.repository).exec(input)
    return report.anonymize()
  }
}
