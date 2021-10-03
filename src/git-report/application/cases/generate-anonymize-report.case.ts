import {inject, injectable} from 'tsyringe'
import {UseCase} from '../../../core/domain/use-case'
import {GenerateReportInput, GenerateReportUseCase} from './generate-report.case'
import {GitReport} from '../../domain/git-report'
import {GitReportRepository} from '../git-report.repository'
import {GitReportImplementationRepository} from '../../infrastructure/git-report.implementation.repository'
import {GitReportPrinter} from '../../infrastructure/cli/git-report.printer'
import {GenerateUpdatedReportCase} from './generate-updated-report.case'

export interface GenerateUpdatedReportInput extends GenerateReportInput {
  /**
   * Force update git repository before read git log.
   */
  forceUpdate: boolean
}

@injectable()
export class GenerateAnonymizeReportUseCase implements UseCase<GenerateReportInput, Promise<GitReport>> {
  constructor(
    @inject(GitReportImplementationRepository) private repository: GitReportRepository,
    @inject(GitReportPrinter) private readonly printer: GitReportPrinter,
  ) {}

  async exec({forceUpdate, ...input}: GenerateUpdatedReportInput): Promise<GitReport> {
    const report = forceUpdate ?
      await new GenerateUpdatedReportCase(this.repository, this.printer).exec(input) :
      await new GenerateReportUseCase(this.repository, this.printer).exec(input)
    return report.anonymize()
  }
}
