import { inject, injectable } from 'tsyringe'
import { GenerateAnonymizeReportUseCase } from '@gitReport/application/cases/generateAnonymizeReport.case'
import { GitReportRepository } from '@gitReport/infrastructure/gitReport.repository'
import { UseCase } from '@core/domain/useCase'
import { GenerateReportForProjectsInDirectoryInput } from '@gitReport/application/cases/generateReportForProjectsInDirectory.case'
import { GitReport } from '@gitReport/domain/gitReport'

@injectable()
export class GenerateAnonymizeReportForProjectsInDirectoryUseCase
implements UseCase<GenerateReportForProjectsInDirectoryInput, Promise<GitReport>> {
  constructor (@inject(GitReportRepository) private repository: GitReportRepository) {}

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
