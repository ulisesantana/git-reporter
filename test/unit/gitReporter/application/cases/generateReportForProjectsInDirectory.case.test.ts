import { container } from 'tsyringe'
import { expectedReport, rawGitLog } from '../../../../fixtures'
import { Command } from '../../../../../src/core/infrastructure/command'
import { Logger } from '../../../../../src/core/infrastructure/logger'
import { GitReportImplementationRepository } from '../../../../../src/gitReport/infrastructure/gitReport.implementation.repository'
import { GenerateReportForProjectsInDirectoryUseCase } from '../../../../../src/gitReport/application/cases/generateReportForProjectsInDirectory.case'

describe('Generate a git report reading all git projects in a directory use case', () => {
  let gitReporterRepository: GitReportImplementationRepository
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
    gitReporterRepository = container.resolve(GitReportImplementationRepository)
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
