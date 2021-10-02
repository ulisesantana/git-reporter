import { inject, injectable } from 'tsyringe'
import { UseCase } from '../../../core/domain/useCase'
import { GenerateReportInput, GenerateReportUseCase } from './generateReport.case'
import { GitReport } from '../../domain/gitReport'
import { GitReportRepository } from '../gitReport.repository'
import { GitReportImplementationRepository } from '../../infrastructure/gitReport.implementation.repository'

@injectable()
export class GenerateAnonymizeReportUseCase implements UseCase<GenerateReportInput, Promise<GitReport>> {
  constructor (@inject(GitReportImplementationRepository) private repository: GitReportRepository) {}

  async exec (input: GenerateReportInput): Promise<GitReport> {
    const report = await new GenerateReportUseCase(this.repository).exec(input)
    return report.anonymize()
  }
}
