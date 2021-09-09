import { container } from 'tsyringe'
import { expectedReport, rawGitLog } from '@test/fixtures'
import { GenerateAnonymizeReportUseCase } from '@gitReport/application/cases/generateAnonymizeReport.case'
import { Command } from '@core/infrastructure/command'
import { GitReportRepository } from '@gitReport/infrastructure/gitReport.repository'
import { Logger } from '@core/infrastructure/logger'

describe('Generate an anonymize git report based on project paths use case', () => {
  let gitReporterRepository: GitReportRepository

  beforeEach(() => {
    container.clearInstances()
    const commandMock = container.resolve(Command)
    commandMock.run = async () => rawGitLog
    container.registerInstance(Command, commandMock)
    const loggerMock = container.resolve(Logger)
    loggerMock.info = jest.fn()
    loggerMock.error = jest.fn()
    container.registerInstance(Logger, loggerMock)
    gitReporterRepository = container.resolve(GitReportRepository)
    gitReporterRepository.readGitProjects = jest.fn(async () => ['irrelevant'])
  })

  it('anonymizes committers personal data', async () => {
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
})
