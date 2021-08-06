import { inject, injectable } from 'tsyringe'
import { GitReportRepository } from '../../infrastructure/gitReport.repository'
import { UseCase } from '../../../useCase'
import { GitReport } from '../gitReport'
import { GenerateReportInput, GenerateReportUseCase } from './generateReport'

@injectable()
export class GenerateAnonymizeReportUseCase implements UseCase<GenerateReportInput, Promise<GitReport>> {
  constructor (@inject(GitReportRepository) private repository: GitReportRepository) {}

  async exec (input: GenerateReportInput): Promise<GitReport> {
    const report = await new GenerateReportUseCase(this.repository).exec(input)
    return report.anonymize()
  }
}
