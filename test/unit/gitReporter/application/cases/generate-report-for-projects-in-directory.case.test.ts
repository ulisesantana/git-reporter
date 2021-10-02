import {container} from 'tsyringe'
import {expectedReport, rawGitLog} from '../../../../fixtures'
import {Shell} from '../../../../../src/core/infrastructure/shell'
import {GitReportImplementationRepository} from '../../../../../src/git-report/infrastructure/git-report.implementation.repository'
import {GenerateReportForProjectsInDirectoryUseCase} from '../../../../../src/git-report/application/cases/generate-report-for-projects-in-directory.case'
import {GitReportPrinter} from '../../../../../src/git-report/infrastructure/cli/git-report.printer'
import {noop} from '../../../../noop'

describe('Generate a git report reading all git projects in a directory use case', () => {
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

  it('generates a report successfully', async () => {
    const report = await new GenerateReportForProjectsInDirectoryUseCase(gitReporterRepository, printerMock)
    .exec({
      directoryPath: 'path/irrelevant',
      weeks: 4,
    })

    expect(report.committers).toStrictEqual(expectedReport.committers)
    expect(report.projects).toStrictEqual(expectedReport.projects)
    expect(report.weeks).toStrictEqual(expectedReport.weeks)
    expect(report.totalCommits).toStrictEqual(expectedReport.totalCommits)
    expect(report.totalFilesChanged).toStrictEqual(expectedReport.totalFilesChanged)
    expect(report.totalInsertions).toStrictEqual(expectedReport.totalInsertions)
    expect(report.totalDeletions).toStrictEqual(expectedReport.totalDeletions)
  })

  it('generates an empty report if no project paths are given', async () => {
    gitReporterRepository.readGitProjects = jest.fn(async () => [])

    const report = await new GenerateReportForProjectsInDirectoryUseCase(gitReporterRepository, printerMock)
    .exec({
      directoryPath: 'path/irrelevant',
      weeks: 4,
    })

    expect(report.committers).toStrictEqual([])
    expect(report.projects).toStrictEqual([])
    expect(report.weeks).toBe(0)
    expect(report.totalCommits).toBe(0)
    expect(report.totalFilesChanged).toBe(0)
    expect(report.totalInsertions).toBe(0)
    expect(report.totalDeletions).toBe(0)
  })
})
