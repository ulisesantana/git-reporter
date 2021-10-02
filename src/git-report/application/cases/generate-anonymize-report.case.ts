import {inject, injectable} from 'tsyringe'
import {UseCase} from '../../../core/domain/use-case'
import {GenerateReportInput, GenerateReportUseCase} from './generate-report.case'
import {GitReport} from '../../domain/git-report'
import {GitReportRepository} from '../git-report.repository'
import {GitReportImplementationRepository} from '../../infrastructure/git-report.implementation.repository'
import {GitReportPrinter} from '../../infrastructure/cli/git-report.printer'

@injectable()
export class GenerateAnonymizeReportUseCase implements UseCase<GenerateReportInput, Promise<GitReport>> {
  constructor(
    @inject(GitReportImplementationRepository) private repository: GitReportRepository,
    @inject(GitReportPrinter) private readonly printer: GitReportPrinter,
  ) {}

  async exec(input: GenerateReportInput): Promise<GitReport> {
    const report = await new GenerateReportUseCase(this.repository, this.printer).exec(input)
    return report.anonymize()
  }
}
