import { container } from 'tsyringe'
import { expectedReport, rawGitLog } from '../../../../fixtures'
import { GenerateAnonymizeReportUseCase } from '../../../../../src/gitReport/application/cases/generateAnonymizeReport.case'
import { Command } from '../../../../../src/core/infrastructure/command'
import { GitReportCommandRepository } from '../../../../../src/gitReport/infrastructure/gitReport.command.repository'
import { Logger } from '../../../../../src/core/infrastructure/logger'

describe('Generate an anonymize git report based on project paths use case', () => {
  let gitReporterRepository: GitReportCommandRepository

  beforeEach(() => {
    container.clearInstances()
    const commandMock = container.resolve(Command)
    commandMock.run = async () => rawGitLog
    container.registerInstance(Command, commandMock)
    const loggerMock = container.resolve(Logger)
    loggerMock.info = jest.fn()
    loggerMock.error = jest.fn()
    container.registerInstance(Logger, loggerMock)
    gitReporterRepository = container.resolve(GitReportCommandRepository)
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
