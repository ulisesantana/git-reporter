import { expectedReport, rawGitLog } from '../fixtures'
import { GitReportRepository } from '../../src/gitReport/infrastructure/gitReport.repository'
import { Logger } from '../../src/logger'
import { container } from 'tsyringe'
import { Command } from '../../src/command'
import { GenerateAnonymizeReportUseCase } from '../../src/gitReport/domain/cases/generateAnonymizeReport'

it('generate a git report based on project paths anonymizing committers personal data', async () => {
  container.clearInstances()
  const commandMock = container.resolve(Command)
  commandMock.run = async () => rawGitLog
  container.registerInstance(Command, commandMock)
  const loggerMock = container.resolve(Logger)
  loggerMock.info = jest.fn()
  loggerMock.error = jest.fn()
  container.registerInstance(Logger, loggerMock)
  const gitReporterRepository = container.resolve(GitReportRepository)
  gitReporterRepository.readGitProjects = jest.fn(async () => ['irrelevant'])

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