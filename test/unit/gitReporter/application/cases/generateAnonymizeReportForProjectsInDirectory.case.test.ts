import { container } from 'tsyringe'
import { expectedReport, rawGitLog } from '../../../../fixtures'
import { GenerateAnonymizeReportForProjectsInDirectoryUseCase } from '../../../../../src/gitReport/application/cases/generateAnonymizeReportForProjectsInDirectory.case'
import { Command } from '../../../../../src/core/infrastructure/command'
import { GitReportImplementationRepository } from '../../../../../src/gitReport/infrastructure/gitReport.implementation.repository'
import { Logger } from '../../../../../src/core/infrastructure/logger'

describe('Generate an anonymize git report reading all git projects in a directory use case', () => {
  let gitReporterRepository: GitReportImplementationRepository

  beforeEach(() => {
    container.clearInstances()
    const commandMock = container.resolve(Command)
    commandMock.run = async () => rawGitLog
    container.registerInstance(Command, commandMock)
    const loggerMock = container.resolve(Logger)
    loggerMock.info = jest.fn()
    loggerMock.error = jest.fn()
    container.registerInstance(Logger, loggerMock)
    gitReporterRepository = container.resolve(GitReportImplementationRepository)
    gitReporterRepository.readGitProjects = jest.fn(async () => ['irrelevant'])
  })

  it('anonymizes committers personal data', async () => {
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
})
