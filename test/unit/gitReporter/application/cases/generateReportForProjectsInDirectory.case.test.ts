import { container } from 'tsyringe'
import { expectedReport, rawGitLog } from '@test/fixtures'
import { Command } from '@core/infrastructure/command'
import { Logger } from '@core/infrastructure/logger'
import { GitReportRepository } from '@gitReport/infrastructure/gitReport.repository'
import { GenerateReportForProjectsInDirectoryUseCase } from '@gitReport/application/cases/generateReportForProjectsInDirectory.case'

describe('Generate a git report reading all git projects in a directory use case', () => {
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

  it('generates a report successfully', async () => {
    const report = await new GenerateReportForProjectsInDirectoryUseCase(gitReporterRepository)
      .exec({
        directoryPath: 'path/irrelevant',
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

  it('generates an empty report if no project paths are given', async () => {
    gitReporterRepository.readGitProjects = jest.fn(async () => [])

    const report = await new GenerateReportForProjectsInDirectoryUseCase(gitReporterRepository)
      .exec({
        directoryPath: 'path/irrelevant',
        weeks: 4
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
