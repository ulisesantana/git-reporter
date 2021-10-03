import {container} from 'tsyringe'
import {expectedReport, expectedReportForMultipleRepositories, rawGitLog} from '../../../../fixtures'
import {Shell} from '../../../../../src/core/infrastructure/shell'
import {GitReportImplementationRepository} from '../../../../../src/git-report/infrastructure/git-report.implementation.repository'
import {GenerateReportUseCase} from '../../../../../src/git-report/application/cases/generate-report.case'
import {GitReportPrinter} from '../../../../../src/git-report/infrastructure/cli/git-report.printer'

describe('Generate a git report based on project paths use case', () => {
  let gitReporterRepository: GitReportImplementationRepository
  let printerMock: GitReportPrinter

  beforeEach(() => {
    container.clearInstances()
    const commandMock = container.resolve(Shell)
    commandMock.run = async () => rawGitLog
    container.registerInstance(Shell, commandMock)
    printerMock = container.resolve(GitReportPrinter)
    container.registerInstance(GitReportPrinter, printerMock)
    gitReporterRepository = container.resolve(GitReportImplementationRepository)
    gitReporterRepository.readGitProjects = jest.fn(async () => ['irrelevant'])
  })

  it('generates a report without updating git repository', async () => {
    const readGitReportSpy = jest.spyOn(gitReporterRepository, 'readGitReport')

    await new GenerateReportUseCase(gitReporterRepository, printerMock)
    .exec({
      projectsPaths: ['path/irrelevant'],
      weeks: 4,
    })

    expect(readGitReportSpy).toHaveBeenCalledWith({projectPath: 'path/irrelevant', weeks: 4, updateBeforeRead: false})
  })

  it('generates a report from a single repository', async () => {
    const report = await new GenerateReportUseCase(gitReporterRepository, printerMock)
    .exec({
      projectsPaths: ['path/irrelevant'],
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

  it('generates a report from multiple repositories', async () => {
    const report = await new GenerateReportUseCase(gitReporterRepository, printerMock)
    .exec({
      projectsPaths: [
        'path/irrelevant',
        'path/irrelevant',
      ],
      weeks: 4,
    })

    expect(report.committers).toStrictEqual(expectedReportForMultipleRepositories.committers)
    expect(report.projects).toStrictEqual(expectedReportForMultipleRepositories.projects)
    expect(report.weeks).toStrictEqual(expectedReportForMultipleRepositories.weeks)
    expect(report.totalCommits).toStrictEqual(expectedReportForMultipleRepositories.totalCommits)
    expect(report.totalFilesChanged).toStrictEqual(expectedReportForMultipleRepositories.totalFilesChanged)
    expect(report.totalInsertions).toStrictEqual(expectedReportForMultipleRepositories.totalInsertions)
    expect(report.totalDeletions).toStrictEqual(expectedReportForMultipleRepositories.totalDeletions)
  })

  it('generates an empty report if no project paths are given', async () => {
    const report = await new GenerateReportUseCase(gitReporterRepository, printerMock)
    .exec({
      projectsPaths: [],
      weeks: 4,
    })

    expect(report.totalCommits).toBe(0)
    expect(report.committers).toStrictEqual([])
  })
})
