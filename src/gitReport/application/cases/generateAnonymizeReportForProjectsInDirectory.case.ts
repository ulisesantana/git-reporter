import { inject, injectable } from 'tsyringe'
import { GenerateAnonymizeReportUseCase } from '@gitReport/application/cases/generateAnonymizeReport.case'
import { GitReportCommandRepository } from '@gitReport/infrastructure/gitReport.command.repository'
import { UseCase } from '@core/domain/useCase'
import { GenerateReportForProjectsInDirectoryInput } from '@gitReport/application/cases/generateReportForProjectsInDirectory.case'
import { GitReport } from '@gitReport/domain/gitReport'
import { GitReportRepository } from '@gitReport/domain/gitReport.repository'

@injectable()
export class GenerateAnonymizeReportForProjectsInDirectoryUseCase
implements UseCase<GenerateReportForProjectsInDirectoryInput, Promise<GitReport>> {
  constructor (@inject(GitReportCommandRepository) private repository: GitReportRepository) {}

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
