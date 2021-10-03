import {inject, injectable} from 'tsyringe'
import {GitReportRepository} from '../git-report.repository'
import {UseCase} from '../../../core/domain/use-case'
import {GitReport} from '../../domain/git-report'
import {GitReportImplementationRepository} from '../../infrastructure/git-report.implementation.repository'
import {GitReportList} from '../../domain/git-report-list'
import {GitReportPrinter, ProgressBar} from '../../infrastructure/cli/git-report.printer'
import {EOL} from 'os'
import {GenerateReportInput} from './generate-report.case'

@injectable()
export class GenerateUpdatedReportCase implements UseCase<GenerateReportInput, Promise<GitReport>> {
  constructor(
    @inject(GitReportImplementationRepository) private repository: GitReportRepository,
    @inject(GitReportPrinter) private readonly printer: GitReportPrinter,
  ) {}

  async exec({projectsPaths, weeks}: GenerateReportInput): Promise<GitReport> {
    const progress = this.printer.generateProgressBar('git projects updated')
    progress.start(projectsPaths.length, 0)

    if (projectsPaths.length === 0) {
      progress.stop()
      this.printer.info(EOL)
      return new GitReportList([]).mergeReports()
    }

    const {successfulReports, failedReports} = await this.generateReports(projectsPaths, weeks, progress)

    progress.stop()

    this.printer.info(EOL)
    this.printer.printFailedReports(failedReports)

    return  new GitReportList(successfulReports).mergeReports()
  }

  private async generateReports(projectsPaths: string[], weeks: number, progress: ProgressBar) {
    const reports = await Promise.all(projectsPaths.map(async projectPath => {
      // Sucks awaiting something inside a Promise.all,
      // but otherwise the progress bar will be waiting once completed.
      // This is because when you run a Promise.all all the callbacks will be executed
      // and after that the event loop will be waiting for all the promises to be fulfilled.
      const report = await this.repository.readGitReport({projectPath, weeks, updateBeforeRead: true})
      progress.increment()
      return report
    }))

    return {
      successfulReports: reports.filter(report => !report.hasFailed()),
      failedReports: reports.filter(report => report.hasFailed()),
    }
  }
}
