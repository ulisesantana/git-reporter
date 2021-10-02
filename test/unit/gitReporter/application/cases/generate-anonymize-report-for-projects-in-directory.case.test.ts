import {container} from 'tsyringe'
import {expectedReport, rawGitLog} from '../../../../fixtures'
import {GenerateAnonymizeReportForProjectsInDirectoryUseCase} from '../../../../../src/git-report/application/cases/generate-anonymize-report-for-projects-in-directory.case'
import {Shell} from '../../../../../src/core/infrastructure/shell'
import {GitReportImplementationRepository} from '../../../../../src/git-report/infrastructure/git-report.implementation.repository'
import {GitReportPrinter} from '../../../../../src/git-report/infrastructure/cli/git-report.printer'

describe('Generate an anonymize git report reading all git projects in a directory use case', () => {
  const noop = () => {}
  let gitReporterRepository: GitReportImplementationRepository
  let printerMock: GitReportPrinter

  beforeEach(() => {
    container.clearInstances()
    const commandMock = container.resolve(Shell)
    commandMock.run = async () => rawGitLog
    container.registerInstance(Shell, commandMock)
    printerMock = container.resolve(GitReportPrinter)
    printerMock.generateProgressBar = () => ({
      start: noop,
      update: noop,
      increment: noop,
      stop: noop,
    })
    container.registerInstance(GitReportPrinter, printerMock)
    gitReporterRepository = container.resolve(GitReportImplementationRepository)
    gitReporterRepository.readGitProjects = jest.fn(async () => ['irrelevant'])
  })

  it('anonymizes committers personal data', async () => {
    const report = await new GenerateAnonymizeReportForProjectsInDirectoryUseCase(gitReporterRepository, printerMock)
    .exec({
      directoryPath: 'path/irrelevant',
      weeks: 4,
    })

    expect(report.totalCommits).toBe(expectedReport.totalCommits)
    expect(report.projects).toStrictEqual(expectedReport.projects)
    expect(report.weeks).toBe(expectedReport.weeks)
    for (const [index, anonymizedCommitter] of report.committers.entries()) {
      expect(anonymizedCommitter.totalCommits).toBe(expectedReport.committers[index].totalCommits)
      expect(anonymizedCommitter.email).not.toBe(expectedReport.committers[index].email)
      expect(anonymizedCommitter.name).not.toBe(expectedReport.committers[index].name)
    }
  })
})