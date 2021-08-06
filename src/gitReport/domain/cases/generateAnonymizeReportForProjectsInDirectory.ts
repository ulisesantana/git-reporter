import { UseCase } from '../../../useCase'
import { inject, injectable } from 'tsyringe'
import { GitReportRepository } from '../../infrastructure/gitReport.repository'
import { GitReport } from '../gitReport'
import { GenerateReportForProjectsInDirectoryInput } from './generateReportForProjectsInDirectory'
import { GenerateAnonymizeReportUseCase } from './generateAnonymizeReport'

@injectable()
export class GenerateAnonymizeReportForProjectsInDirectoryUseCase
implements UseCase<GenerateReportForProjectsInDirectoryInput, Promise<GitReport>> {
  constructor (@inject(GitReportRepository) private repository: GitReportRepository) {}

  async exec ({ directoryPath, weeks }: GenerateReportForProjectsInDirectoryInput): Promise<GitReport> {
    const projectsPaths = await this.repository.readGitProjects(directoryPath)
    return new GenerateAnonymizeReportUseCase(this.repository).exec({
      projectsPaths,
      weeks
    })
  }
}
