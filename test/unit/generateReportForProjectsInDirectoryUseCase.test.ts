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

  it('retrieving total commits', async () => {
    const report = await new GenerateReportForProjectsInDirectoryUseCase(gitReporterRepository)
      .exec({
        directoryPath: 'path/irrelevant',
        weeks: 4
      })

    expect(report.totalCommits).toBe(expectedReport.totalCommits)
  })

  it('retrieving total commits for each committer', async () => {
    const report = await new GenerateReportForProjectsInDirectoryUseCase(gitReporterRepository)
      .exec({
        directoryPath: 'path/irrelevant',
        weeks: 4
      })

    expect(report.committers).toStrictEqual(expectedReport.committers)
  })

  it('retrieving the amount of weeks used for generating the report', async () => {
    const report = await new GenerateReportForProjectsInDirectoryUseCase(gitReporterRepository)
      .exec({
        directoryPath: 'path/irrelevant',
        weeks: 4
      })

    expect(report.weeks).toBe(expectedReport.weeks)
  })

  it('retrieving the projects used for generating the report', async () => {
    const report = await new GenerateReportForProjectsInDirectoryUseCase(gitReporterRepository)
      .exec({
        directoryPath: 'path/irrelevant',
        weeks: 4
      })

    expect(report.projects).toStrictEqual(expectedReport.projects)
  })
})
