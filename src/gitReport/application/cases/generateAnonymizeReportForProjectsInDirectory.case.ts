import { inject, injectable } from 'tsyringe'
import { GenerateAnonymizeReportUseCase } from './generateAnonymizeReport.case'
import { GitReportImplementationRepository } from '../../infrastructure/gitReport.implementation.repository'
import { UseCase } from '../../../core/domain/useCase'
import { GenerateReportForProjectsInDirectoryInput } from './generateReportForProjectsInDirectory.case'
import { GitReport } from '../../domain/gitReport'
import { GitReportRepository } from '../gitReport.repository'

@injectable()
export class GenerateAnonymizeReportForProjectsInDirectoryUseCase
implements UseCase<GenerateReportForProjectsInDirectoryInput, Promise<GitReport>> {
  constructor (@inject(GitReportImplementationRepository) private repository: GitReportRepository) {}

  async exec ({
    directoryPath,
    weeks
  }: GenerateReportForProjectsInDirectoryInput): Promise<GitReport> {
    const projectsPaths = await this.repository.readGitProjects(directoryPath)
    return new GenerateAnonymizeReportUseCase(this.repository).exec({
      projectsPaths,
      weeks
    })
  }
}
