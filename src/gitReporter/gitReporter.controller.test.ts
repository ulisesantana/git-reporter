import {
  expectedReport, expectedReportOutput
} from './fixture'
import { container } from 'tsyringe'
import { GitReporterService } from './gitReporter.service'
import { Notifier } from '../notifier'
import { GitReporterController } from './gitReporter.controller'
import { Logger } from '../logger'

describe('Git Reporter Controller should', () => {
  let gitReporterServiceMock: GitReporterService
  let notifierMock: Notifier
  let loggerMock: Logger

  beforeEach(() => {
    container.clearInstances()
    gitReporterServiceMock = container.resolve(GitReporterService)
    gitReporterServiceMock.generateReport = jest.fn(async () => expectedReport)
    gitReporterServiceMock.generateAnonymousReport = jest.fn(async () => expectedReport)
    gitReporterServiceMock.generateReportForAllProjectsInADirectory = jest.fn(async () => expectedReport)
    gitReporterServiceMock.generateAnonymousReportForAllProjectsInADirectory = jest.fn(async () => expectedReport)

    notifierMock = container.resolve(Notifier)
    notifierMock.publishOnSlack = jest.fn(async () => {})

    loggerMock = container.resolve(Logger)
    loggerMock.info = jest.fn()
    loggerMock.error = jest.fn()
  })

  it('print report for all the given projects', async () => {
    await new GitReporterController(gitReporterServiceMock, notifierMock, loggerMock)
      .exec({
        allInDirectory: '',
        anonymize: false,
        projects: ['irrelevant'],
        weeks: 4,
        slackUrl: 'irrelevant'
      })

    expect(loggerMock.info).toHaveBeenNthCalledWith(1, expectedReportOutput)
    expect(gitReporterServiceMock.generateReport).toBeCalled()
  })

  it('print anonymized report for all the given projects', async () => {
    await new GitReporterController(gitReporterServiceMock, notifierMock, loggerMock)
      .exec({
        allInDirectory: '',
        anonymize: true,
        projects: ['irrelevant'],
        weeks: 4,
        slackUrl: 'irrelevant'
      })

    expect(loggerMock.info).toHaveBeenNthCalledWith(1, expectedReportOutput)
    expect(gitReporterServiceMock.generateAnonymousReport).toBeCalled()
  })

  it('print report for all the projects inside the given directory', async () => {
    await new GitReporterController(gitReporterServiceMock, notifierMock, loggerMock)
      .exec({
        allInDirectory: 'path/irrelevant',
        anonymize: false,
        projects: [],
        weeks: 4,
        slackUrl: 'irrelevant'
      })

    expect(loggerMock.info).toHaveBeenNthCalledWith(1, expectedReportOutput)
    expect(gitReporterServiceMock.generateReportForAllProjectsInADirectory).toBeCalled()
  })

  it('print anonymized report for all the projects inside the given directory', async () => {
    await new GitReporterController(gitReporterServiceMock, notifierMock, loggerMock)
      .exec({
        allInDirectory: 'path/irrelevant',
        anonymize: true,
        projects: [],
        weeks: 4,
        slackUrl: 'irrelevant'
      })

    expect(loggerMock.info).toHaveBeenNthCalledWith(1, expectedReportOutput)
    expect(gitReporterServiceMock.generateAnonymousReportForAllProjectsInADirectory).toBeCalled()
  })

  it('notify report on slack', async () => {
    await new GitReporterController(gitReporterServiceMock, notifierMock, loggerMock)
      .exec({
        allInDirectory: '',
        anonymize: false,
        projects: ['irrelevant'],
        weeks: 4,
        slackUrl: 'irrelevant'
      })

    expect(notifierMock.publishOnSlack).toBeCalledWith('irrelevant', expectedReportOutput)
    expect(loggerMock.info).toHaveBeenNthCalledWith(
      2,
      'Report published on Slack.'
    )
  })

  it('not notify report on slack if slack url is an empty string', async () => {
    await new GitReporterController(gitReporterServiceMock, notifierMock, loggerMock)
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
