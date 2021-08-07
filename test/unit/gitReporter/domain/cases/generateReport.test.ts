import { expectedReport, expectedReportForMultipleRepositories, rawGitLog } from '../../../../fixtures'
import { GitReportRepository } from '../../../../../src/gitReport/infrastructure/gitReport.repository'
import { Logger } from '../../../../../src/logger'
import { container } from 'tsyringe'
import { Command } from '../../../../../src/command'
import { GenerateReportUseCase } from '../../../../../src/gitReport/domain/cases/generateReport'

describe('Generate a git report based on project paths use case', () => {
  let gitReporterRepository: GitReportRepository
  let loggerMock: Logger

  beforeEach(() => {
    container.clearInstances()
    const commandMock = container.resolve(Command)
    commandMock.run = async () => rawGitLog
    container.registerInstance(Command, commandMock)
    loggerMock = container.resolve(Logger)
    loggerMock.info = jest.fn()
    loggerMock.error = jest.fn()
    container.registerInstance(Logger, loggerMock)
    gitReporterRepository = container.resolve(GitReportRepository)
    gitReporterRepository.readGitProjects = jest.fn(async () => ['irrelevant'])
  })

  it('generates a report from a single repository', async () => {
    const report = await new GenerateReportUseCase(gitReporterRepository)
      .exec({
        projectsPaths: ['path/irrelevant'],
        weeks: 4
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
    const report = await new GenerateReportUseCase(gitReporterRepository)
      .exec({
        projectsPaths: [
          'path/irrelevant',
          'path/irrelevant'
        ],
        weeks: 4
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
    const report = await new GenerateReportUseCase(gitReporterRepository)
      .exec({
        projectsPaths: [],
        weeks: 4
      })

    expect(report.totalCommits).toBe(0)
    expect(report.committers).toStrictEqual([])
  })
})