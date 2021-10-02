import {inject, injectable} from 'tsyringe'
import {GitReportRepository} from '../git-report.repository'
import {UseCase} from '../../../core/domain/use-case'
import {GenerateReportUseCase} from './generate-report.case'
import {GitReport} from '../../domain/git-report'
import {GitReportImplementationRepository} from '../../infrastructure/git-report.implementation.repository'
import {GitReportPrinter} from '../../infrastructure/cli/git-report.printer'

export interface GenerateReportForProjectsInDirectoryInput {
  /**
   * Directory path where all the projects to be reported are stored
   */
  readonly directoryPath: string
  /**
   * Amount of last weeks to be reported
   */
  readonly weeks: number
}

@injectable()
export class GenerateReportForProjectsInDirectoryUseCase
implements UseCase<GenerateReportForProjectsInDirectoryInput, Promise<GitReport>> {
  constructor(
    @inject(GitReportImplementationRepository) private repository: GitReportRepository,
    @inject(GitReportPrinter) private readonly printer: GitReportPrinter,
  ) {}

  async exec({directoryPath, weeks}: GenerateReportForProjectsInDirectoryInput): Promise<GitReport> {
    const projectsPaths = await this.repository.readGitProjects(directoryPath)
    return new GenerateReportUseCase(this.repository, this.printer).exec({
      projectsPaths,
      weeks,
    })
  }
}
