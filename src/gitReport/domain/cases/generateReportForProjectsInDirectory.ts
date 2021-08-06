import { UseCase } from '../../../useCase'
import { inject, injectable } from 'tsyringe'
import { GitReportRepository } from '../../infrastructure/gitReport.repository'
import { GitReport } from '../gitReport'
import { GenerateReportUseCase } from './generateReport'

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
  constructor (@inject(GitReportRepository) private repository: GitReportRepository) {}

  async exec ({ directoryPath, weeks }: GenerateReportForProjectsInDirectoryInput): Promise<GitReport> {
    const projectsPaths = await this.repository.readGitProjects(directoryPath)
    return new GenerateReportUseCase(this.repository).exec({
      projectsPaths,
      weeks
    })
  }
}
