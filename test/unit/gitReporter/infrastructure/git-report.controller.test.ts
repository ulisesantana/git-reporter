import {container} from 'tsyringe'
import {expectedReportOutput, rawGitLog} from '../../../fixtures'
import {Shell} from '../../../../src/core/infrastructure/shell'
import {GitReportImplementationRepository} from '../../../../src/gitReport/infrastructure/git-report.implementation.repository'
import {Logger} from '../../../../src/core/infrastructure/logger'
import {GitReportController} from '../../../../src/gitReport/infrastructure/git-report.controller'
import {Notifier} from '../../../../src/core/infrastructure/notifier'

describe('Git Reporter Controller should', () => {
  let gitReporterRepository: GitReportImplementationRepository
  let notifierMock: Notifier
  let loggerMock: Logger

  beforeEach(() => {
    container.clearInstances()
    const commandMock = container.resolve(Shell)
    commandMock.run = async () => rawGitLog
    container.registerInstance(Shell, commandMock)

    gitReporterRepository = container.resolve(GitReportImplementationRepository)
    gitReporterRepository.readGitProjects = jest.fn(async () => ['irrelevant'])
    container.registerInstance(GitReportImplementationRepository, gitReporterRepository)

    notifierMock = container.resolve(Notifier)
    notifierMock.publishOnSlack = jest.fn(async () => {})

    loggerMock = container.resolve(Logger)
    loggerMock.info = jest.fn()
    loggerMock.error = jest.fn()
  })

  it('print report for all the given projects', async () => {
    await new GitReportController(notifierMock, loggerMock)
    .exec({
      directory: '',
      anonymize: false,
      projects: ['irrelevant'],
      weeks: 4,
      slackUrl: 'irrelevant',
    })

    expect(loggerMock.info).toHaveBeenNthCalledWith(2, expectedReportOutput)
  })

  it('print anonymized report for all the given projects', async () => {
    await new GitReportController(notifierMock, loggerMock)
    .exec({
      directory: '',
      anonymize: true,
      projects: ['irrelevant'],
      weeks: 4,
      slackUrl: 'irrelevant',
    })

    // @ts-ignore
    const loggerInfoSecondCallWithFirstParameter = loggerMock.info.mock.calls[1][0]
    expect(loggerInfoSecondCallWithFirstParameter).toContain('Total commits in the last 4 weeks: 13')
    expect(loggerInfoSecondCallWithFirstParameter).toContain(`
      Commits: 6
      Files changed: 16
      Insertions: 84
      Deletions: 15`,
    )
    expect(loggerInfoSecondCallWithFirstParameter).not.toContain('Rich Trott (rtrott@gmail.com):')
  })

  it('print report for all the projects inside the given directory', async () => {
    await new GitReportController(notifierMock, loggerMock)
    .exec({
      directory: 'path/irrelevant',
      anonymize: false,
      projects: [],
      weeks: 4,
      slackUrl: 'irrelevant',
    })

    expect(loggerMock.info).toHaveBeenNthCalledWith(2, expectedReportOutput)
  })

  it('print anonymized report for all the projects inside the given directory', async () => {
    await new GitReportController(notifierMock, loggerMock)
    .exec({
      directory: 'path/irrelevant',
      anonymize: true,
      projects: [],
      weeks: 4,
      slackUrl: 'irrelevant',
    })

    // @ts-ignore
    const loggerInfoSecondCallWithFirstParameter = loggerMock.info.mock.calls[1][0]
    expect(loggerInfoSecondCallWithFirstParameter).toContain('Total commits in the last 4 weeks: 13')
    expect(loggerInfoSecondCallWithFirstParameter).toContain(`
      Commits: 6
      Files changed: 16
      Insertions: 84
      Deletions: 15`,
    )
    expect(loggerInfoSecondCallWithFirstParameter).not.toContain('Rich Trott (rtrott@gmail.com):')
  })

  it('print there is no projects to generate report if no git repository is found in the given directory', async () => {
    gitReporterRepository.readGitProjects = jest.fn(async () => [])

    await new GitReportController(notifierMock, loggerMock)
    .exec({
      directory: 'path/irrelevant',
      anonymize: true,
      projects: [],
      weeks: 4,
      slackUrl: 'irrelevant',
    })

    expect(loggerMock.info).toHaveBeenNthCalledWith(
      2,
      '⚠️  There is no git projects to report.',
    )
  })

  it('notify report on slack', async () => {
    await new GitReportController(notifierMock, loggerMock)
    .exec({
      directory: '',
      anonymize: false,
      projects: ['irrelevant'],
      weeks: 4,
      slackUrl: 'irrelevant',
    })

    expect(notifierMock.publishOnSlack).toBeCalledWith('irrelevant', expectedReportOutput)
    expect(loggerMock.info).toHaveBeenNthCalledWith(
      3,
      'Report published on Slack.',
    )
  })

  it('not notify report on slack if slack url is an empty string', async () => {
    await new GitReportController(notifierMock, loggerMock)
    .exec({
      directory: '',
      anonymize: false,
      projects: ['irrelevant'],
      weeks: 4,
      slackUrl: '',
    })

    expect(notifierMock.publishOnSlack).not.toBeCalled()
  })
})
