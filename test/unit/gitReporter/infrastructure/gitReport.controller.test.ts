import { expectedReportOutput, rawGitLog } from '../../../fixtures'
import { container } from 'tsyringe'
import { Notifier } from '../../../../src/notifier'
import { GitReportController } from '../../../../src/gitReport/infrastructure/gitReport.controller'
import { Logger } from '../../../../src/logger'
import { GitReportRepository } from '../../../../src/gitReport/infrastructure/gitReport.repository'
import { Command } from '../../../../src/command'

describe('Git Reporter Controller should', () => {
  let gitReporterRepository: GitReportRepository
  let notifierMock: Notifier
  let loggerMock: Logger

  beforeEach(() => {
    container.clearInstances()
    const commandMock = container.resolve(Command)
    commandMock.run = async () => rawGitLog
    container.registerInstance(Command, commandMock)

    gitReporterRepository = container.resolve(GitReportRepository)
    gitReporterRepository.readGitProjects = jest.fn(async () => ['irrelevant'])
    container.registerInstance(GitReportRepository, gitReporterRepository)

    notifierMock = container.resolve(Notifier)
    notifierMock.publishOnSlack = jest.fn(async () => {})

    loggerMock = container.resolve(Logger)
    loggerMock.info = jest.fn()
    loggerMock.error = jest.fn()
  })

  it('print report for all the given projects', async () => {
    await new GitReportController(notifierMock, loggerMock)
      .exec({
        allInDirectory: '',
        anonymize: false,
        projects: ['irrelevant'],
        weeks: 4,
        slackUrl: 'irrelevant'
      })

    expect(loggerMock.info).toHaveBeenNthCalledWith(2, expectedReportOutput)
  })

  it('print anonymized report for all the given projects', async () => {
    await new GitReportController(notifierMock, loggerMock)
      .exec({
        allInDirectory: '',
        anonymize: true,
        projects: ['irrelevant'],
        weeks: 4,
        slackUrl: 'irrelevant'
      })

    // @ts-ignore
    const loggerInfoSecondCallWithFirstParameter = loggerMock.info.mock.calls[1][0]
    expect(loggerInfoSecondCallWithFirstParameter).toContain('Total commits in the last 4 weeks: 13')
    expect(loggerInfoSecondCallWithFirstParameter).toContain(`
      Commits: 6
      Files changed: 16
      Insertions: 84
      Deletions: 15`
    )
    expect(loggerInfoSecondCallWithFirstParameter).not.toContain('Rich Trott (rtrott@gmail.com):')
  })

  it('print report for all the projects inside the given directory', async () => {
    await new GitReportController(notifierMock, loggerMock)
      .exec({
        allInDirectory: 'path/irrelevant',
        anonymize: false,
        projects: [],
        weeks: 4,
        slackUrl: 'irrelevant'
      })

    expect(loggerMock.info).toHaveBeenNthCalledWith(2, expectedReportOutput)
  })

  it('print anonymized report for all the projects inside the given directory', async () => {
    await new GitReportController(notifierMock, loggerMock)
      .exec({
        allInDirectory: 'path/irrelevant',
        anonymize: true,
        projects: [],
        weeks: 4,
        slackUrl: 'irrelevant'
      })

    // @ts-ignore
    const loggerInfoSecondCallWithFirstParameter = loggerMock.info.mock.calls[1][0]
    expect(loggerInfoSecondCallWithFirstParameter).toContain('Total commits in the last 4 weeks: 13')
    expect(loggerInfoSecondCallWithFirstParameter).toContain(`
      Commits: 6
      Files changed: 16
      Insertions: 84
      Deletions: 15`
    )
    expect(loggerInfoSecondCallWithFirstParameter).not.toContain('Rich Trott (rtrott@gmail.com):')
  })

  it('print there is no projects to generate report if no git repository is found in the given directory', async () => {
    gitReporterRepository.readGitProjects = jest.fn(async () => [])

    await new GitReportController(notifierMock, loggerMock)
      .exec({
        allInDirectory: 'path/irrelevant',
        anonymize: true,
        projects: [],
        weeks: 4,
        slackUrl: 'irrelevant'
      })

    expect(loggerMock.info).toHaveBeenNthCalledWith(
      2,
      '⚠️  There is no git projects to report.'
    )
  })

  it('notify report on slack', async () => {
    await new GitReportController(notifierMock, loggerMock)
      .exec({
        allInDirectory: '',
        anonymize: false,
        projects: ['irrelevant'],
        weeks: 4,
        slackUrl: 'irrelevant'
      })

    expect(notifierMock.publishOnSlack).toBeCalledWith('irrelevant', expectedReportOutput)
    expect(loggerMock.info).toHaveBeenNthCalledWith(
      3,
      'Report published on Slack.'
    )
  })

  it('not notify report on slack if slack url is an empty string', async () => {
    await new GitReportController(notifierMock, loggerMock)
      .exec({
        allInDirectory: '',
        anonymize: false,
        projects: ['irrelevant'],
        weeks: 4,
        slackUrl: ''
      })

    expect(notifierMock.publishOnSlack).not.toBeCalled()
  })
})
