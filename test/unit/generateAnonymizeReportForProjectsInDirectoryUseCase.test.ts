import { expectedReport, rawGitLog } from '../fixtures'
import { GitReportRepository } from '../../src/gitReport/infrastructure/gitReport.repository'
import { Logger } from '../../src/logger'
import { container } from 'tsyringe'
import { Command } from '../../src/command'
import { GenerateAnonymizeReportForProjectsInDirectoryUseCase } from '../../src/gitReport/domain/cases/generateAnonymizeReportForProjectsInDirectory'

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

it('generate a git report reading all git projects in a directory anonymizing committers personal data', async () => {
  const report = await new GenerateAnonymizeReportForProjectsInDirectoryUseCase(gitReporterRepository)
    .exec({
      directoryPath: 'path/irrelevant',
      weeks: 4
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
