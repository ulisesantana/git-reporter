import {inject, injectable} from 'tsyringe'
import {GitReportRepository} from '../git-report.repository'
import {UseCase} from '../../../core/domain/use-case'
import {GitReport} from '../../domain/git-report'
import {GitReportImplementationRepository} from '../../infrastructure/git-report.implementation.repository'
import {GitReportList} from '../../domain/git-report-list'
import {GitReportPrinter} from '../../infrastructure/cli/git-report.printer'
import {EOL} from 'os'

export interface GenerateReportInput {
  /**
   * List of directory paths where the projects to be reported are stored
   */
  readonly projectsPaths: string[]
  /**
   * Amount of last weeks to be reported
   */
  readonly weeks: number
}

@injectable()
export class GenerateReportUseCase implements UseCase<GenerateReportInput, Promise<GitReport>> {
  constructor(
    @inject(GitReportImplementationRepository) private repository: GitReportRepository,
    @inject(GitReportPrinter) private readonly printer: GitReportPrinter,
  ) {}

  async exec({projectsPaths, weeks}: GenerateReportInput): Promise<GitReport> {
    if (projectsPaths.length === 0) {
      this.printer.info(EOL)
      return new GitReportList([]).mergeReports()
    }

    const {successfulReports, failedReports} = await this.generateReports(projectsPaths, weeks)

    this.printer.printFailedReports(failedReports)

    return new GitReportList(successfulReports).mergeReports()
  }

  private async generateReports(projectsPaths: string[], weeks: number) {
    const reports = await Promise.all(projectsPaths.map(async projectPath => {
      return this.repository.readGitReport({projectPath, weeks, updateBeforeRead: false})
    }))

    return {
      successfulReports: reports.filter(report => !report.hasFailed()),
      failedReports: reports.filter(report => report.hasFailed()),
    }
  }
}
