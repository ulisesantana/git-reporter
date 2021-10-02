import {inject, injectable} from 'tsyringe'
import {GenerateAnonymizeReportUseCase} from './generate-anonymize-report.case'
import {GitReportImplementationRepository} from '../../infrastructure/git-report.implementation.repository'
import {UseCase} from '../../../core/domain/use-case'
import {GenerateReportForProjectsInDirectoryInput} from './generate-report-for-projects-in-directory.case'
import {GitReport} from '../../domain/git-report'
import {GitReportRepository} from '../git-report.repository'
import {GitReportPrinter} from '../../infrastructure/cli/git-report.printer'

@injectable()
export class GenerateAnonymizeReportForProjectsInDirectoryUseCase
implements UseCase<GenerateReportForProjectsInDirectoryInput, Promise<GitReport>> {
  constructor(
    @inject(GitReportImplementationRepository) private repository: GitReportRepository,
    @inject(GitReportPrinter) private readonly printer: GitReportPrinter,
  ) {}

  async exec({
    directoryPath,
    weeks,
  }: GenerateReportForProjectsInDirectoryInput): Promise<GitReport> {
    const projectsPaths = await this.repository.readGitProjects(directoryPath)
    return new GenerateAnonymizeReportUseCase(this.repository, this.printer).exec({
      projectsPaths,
      weeks,
    })
  }
}
