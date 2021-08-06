import { expectedReport, rawGitLog } from '../fixtures'
import { GitReportRepository } from '../../src/gitReport/infrastructure/gitReport.repository'
import { Logger } from '../../src/logger'
import { container } from 'tsyringe'
import { Command } from '../../src/command'
import { GenerateAnonymizeReportUseCase } from '../../src/gitReport/domain/cases/generateAnonymizeReport'

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

it('generate a git report based on project paths anonymizing committers personal data', async () => {
  const report = await new GenerateAnonymizeReportUseCase(gitReporterRepository)
    .exec({
      projectsPaths: ['path/irrelevant'],
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
