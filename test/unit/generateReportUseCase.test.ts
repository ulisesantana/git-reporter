import { expectedReport, expectedReportForMultipleRepositories, rawGitLog } from '../fixtures'
import { GitReportRepository } from '../../src/gitReport/infrastructure/gitReport.repository'
import { Logger } from '../../src/logger'
import { container } from 'tsyringe'
import { Command } from '../../src/command'
import { GenerateReportUseCase } from '../../src/gitReport/domain/cases/generateReport'

describe('generate a git report based on project paths', () => {
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

  it('retrieving total commits between all committers', async () => {
    const report = await new GenerateReportUseCase(gitReporterRepository)
      .exec({
        projectsPaths: ['path/irrelevant'],
        weeks: 4
      })

    expect(report.totalCommits).toBe(expectedReport.totalCommits)
  })

  it('retrieving total insertions between all committers', async () => {
    const report = await new GenerateReportUseCase(gitReporterRepository)
      .exec({
        projectsPaths: ['path/irrelevant'],
        weeks: 4
      })

    expect(report.totalInsertions).toBe(expectedReport.totalInsertions)
  })

  it('retrieving total deletions between all committers', async () => {
    const report = await new GenerateReportUseCase(gitReporterRepository)
      .exec({
        projectsPaths: ['path/irrelevant'],
        weeks: 4
      })

    expect(report.totalDeletions).toBe(expectedReport.totalDeletions)
  })

  it('retrieving total files changed between all committers', async () => {
    const report = await new GenerateReportUseCase(gitReporterRepository)
      .exec({
        projectsPaths: ['path/irrelevant'],
        weeks: 4
      })

    expect(report.totalFilesChanged).toBe(expectedReport.totalFilesChanged)
  })

  it('retrieving total commits, files changed, insertions and deletions for each committer', async () => {
    const report = await new GenerateReportUseCase(gitReporterRepository)
      .exec({
        projectsPaths: ['path/irrelevant'],
        weeks: 4
      })

    expect(report.committers).toStrictEqual(expectedReport.committers)
  })

  it('retrieving the amount of weeks used for generating the report', async () => {
    const report = await new GenerateReportUseCase(gitReporterRepository)
      .exec({
        projectsPaths: ['path/irrelevant'],
        weeks: 4
      })

    expect(report.weeks).toBe(expectedReport.weeks)
  })

  it('retrieving the projects used for generating the report', async () => {
    const report = await new GenerateReportUseCase(gitReporterRepository)
      .exec({
        projectsPaths: ['path/irrelevant'],
        weeks: 4
      })

    expect(report.projects).toStrictEqual(expectedReport.projects)
  })

  it('processing multiple repositories', async () => {
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

  it('returning an empty report if no project paths are given', async () => {
    const report = await new GenerateReportUseCase(gitReporterRepository)
      .exec({
        projectsPaths: [],
        weeks: 4
      })

    expect(report.totalCommits).toBe(0)
    expect(report.committers).toStrictEqual([])
  })
})
