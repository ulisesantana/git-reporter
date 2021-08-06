import { expectedReport, rawGitLog } from '../fixtures'
import { GitReportRepository } from '../../src/gitReport/infrastructure/gitReport.repository'
import { Logger } from '../../src/logger'
import { container } from 'tsyringe'
import { Command } from '../../src/command'
import { GenerateReportForProjectsInDirectoryUseCase } from '../../src/gitReport/domain/cases/generateReportForProjectsInDirectory'

describe('generate a git report reading all git projects in a directory', () => {
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

  it('successfully', async () => {
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

  it('returning an empty report if no project paths are given', async () => {
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
