import {container} from 'tsyringe'
import {expectedReport, rawGitLog} from '../../../../fixtures'
import {GenerateAnonymizeReportForProjectsInDirectoryUseCase} from '../../../../../src/git-report/application/cases/generate-anonymize-report-for-projects-in-directory.case'
import {Shell} from '../../../../../src/core/infrastructure/shell'
import {GitReportImplementationRepository} from '../../../../../src/git-report/infrastructure/git-report.implementation.repository'
import {GitReportPrinter} from '../../../../../src/git-report/infrastructure/cli/git-report.printer'
import {noop} from '../../../../noop'

describe('Generate an anonymize git report reading all git projects in a directory use case', () => {
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
      value: 0,
      total: 0,
      increment: noop,
      stop: noop,
    })
    container.registerInstance(GitReportPrinter, printerMock)
    gitReporterRepository = container.resolve(GitReportImplementationRepository)
    gitReporterRepository.readGitProjects = jest.fn(async () => ['irrelevant'])
  })

  it('anonymizes committers personal data', async () => {
    const readGitReportSpy = jest.spyOn(gitReporterRepository, 'readGitReport')

    const report = await new GenerateAnonymizeReportForProjectsInDirectoryUseCase(gitReporterRepository, printerMock)
    .exec({
      directoryPath: 'path/irrelevant',
      weeks: 4,
      forceUpdate: false,
    })

    expect(report.totalCommits).toBe(expectedReport.totalCommits)
    expect(report.projects).toStrictEqual(expectedReport.projects)
    expect(report.weeks).toBe(expectedReport.weeks)
    for (const [index, anonymizedCommitter] of report.committers.entries()) {
      expect(anonymizedCommitter.totalCommits).toBe(expectedReport.committers[index].totalCommits)
      expect(anonymizedCommitter.email).not.toBe(expectedReport.committers[index].email)
      expect(anonymizedCommitter.name).not.toBe(expectedReport.committers[index].name)
    }
    expect(readGitReportSpy).toHaveBeenCalledWith({projectPath: 'irrelevant', weeks: 4, updateBeforeRead: false})
  })

  it('anonymizes committers personal data for updated report', async () => {
    const readGitReportSpy = jest.spyOn(gitReporterRepository, 'readGitReport')

    const report = await new GenerateAnonymizeReportForProjectsInDirectoryUseCase(gitReporterRepository, printerMock)
    .exec({
      directoryPath: 'path/irrelevant',
      weeks: 4,
      forceUpdate: true,
    })

    expect(report.totalCommits).toBe(expectedReport.totalCommits)
    expect(report.projects).toStrictEqual(expectedReport.projects)
    expect(report.weeks).toBe(expectedReport.weeks)
    for (const [index, anonymizedCommitter] of report.committers.entries()) {
      expect(anonymizedCommitter.totalCommits).toBe(expectedReport.committers[index].totalCommits)
      expect(anonymizedCommitter.email).not.toBe(expectedReport.committers[index].email)
      expect(anonymizedCommitter.name).not.toBe(expectedReport.committers[index].name)
    }
    expect(readGitReportSpy).toHaveBeenCalledWith({projectPath: 'irrelevant', weeks: 4, updateBeforeRead: true})
  })
})
