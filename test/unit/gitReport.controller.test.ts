import {
  expectedReport, expectedReportOutput
} from '../fixture'
import { container } from 'tsyringe'
import { GitReportService } from '../../src/gitReport/domain/gitReport.service'
import { Notifier } from '../../src/notifier'
import { GitReportController } from '../../src/gitReport/infrastructure/gitReport.controller'
import { Logger } from '../../src/logger'

describe('Git Reporter Controller should', () => {
  let gitReportServiceMock: GitReportService
  let notifierMock: Notifier
  let loggerMock: Logger

  beforeEach(() => {
    container.clearInstances()
    gitReportServiceMock = container.resolve(GitReportService)
    gitReportServiceMock.generateReport = jest.fn(async () => expectedReport)
    gitReportServiceMock.generateAnonymousReport = jest.fn(async () => expectedReport)
    gitReportServiceMock.generateReportForAllProjectsInADirectory = jest.fn(async () => expectedReport)
    gitReportServiceMock.generateAnonymousReportForAllProjectsInADirectory = jest.fn(async () => expectedReport)

    notifierMock = container.resolve(Notifier)
    notifierMock.publishOnSlack = jest.fn(async () => {})

    loggerMock = container.resolve(Logger)
    loggerMock.info = jest.fn()
    loggerMock.error = jest.fn()
  })

  it('print report for all the given projects', async () => {
    await new GitReportController(gitReportServiceMock, notifierMock, loggerMock)
      .exec({
        allInDirectory: '',
        anonymize: false,
        projects: ['irrelevant'],
        weeks: 4,
        slackUrl: 'irrelevant'
      })

    expect(loggerMock.info).toHaveBeenNthCalledWith(1, expectedReportOutput)
    expect(gitReportServiceMock.generateReport).toBeCalled()
  })

  it('print anonymized report for all the given projects', async () => {
    await new GitReportController(gitReportServiceMock, notifierMock, loggerMock)
      .exec({
        allInDirectory: '',
        anonymize: true,
        projects: ['irrelevant'],
        weeks: 4,
        slackUrl: 'irrelevant'
      })

    expect(loggerMock.info).toHaveBeenNthCalledWith(1, expectedReportOutput)
    expect(gitReportServiceMock.generateAnonymousReport).toBeCalled()
  })

  it('print report for all the projects inside the given directory', async () => {
    await new GitReportController(gitReportServiceMock, notifierMock, loggerMock)
      .exec({
        allInDirectory: 'path/irrelevant',
        anonymize: false,
        projects: [],
        weeks: 4,
        slackUrl: 'irrelevant'
      })

    expect(loggerMock.info).toHaveBeenNthCalledWith(1, expectedReportOutput)
    expect(gitReportServiceMock.generateReportForAllProjectsInADirectory).toBeCalled()
  })

  it('print anonymized report for all the projects inside the given directory', async () => {
    await new GitReportController(gitReportServiceMock, notifierMock, loggerMock)
      .exec({
        allInDirectory: 'path/irrelevant',
        anonymize: true,
        projects: [],
        weeks: 4,
        slackUrl: 'irrelevant'
      })

    expect(loggerMock.info).toHaveBeenNthCalledWith(1, expectedReportOutput)
    expect(gitReportServiceMock.generateAnonymousReportForAllProjectsInADirectory).toBeCalled()
  })

  it('notify report on slack', async () => {
    await new GitReportController(gitReportServiceMock, notifierMock, loggerMock)
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
    await new GitReportController(gitReportServiceMock, notifierMock, loggerMock)
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
