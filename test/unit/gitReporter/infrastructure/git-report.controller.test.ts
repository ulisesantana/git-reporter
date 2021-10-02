import {container} from 'tsyringe'
import {expectedReportCompactOutput, expectedReportVerboseOutput, rawGitLog} from '../../../fixtures'
import {Shell} from '../../../../src/core/infrastructure/shell'
import {GitReportImplementationRepository} from '../../../../src/git-report/infrastructure/git-report.implementation.repository'
import {GitReportController} from '../../../../src/git-report/infrastructure/git-report.controller'
import {Notifier} from '../../../../src/core/infrastructure/notifier'
import {GitReportPrinter} from '../../../../src/git-report/infrastructure/cli/git-report.printer'
import {noop} from '../../../noop'

jest.mock('../../../../src/git-report/infrastructure/cli/git-report.printer')
jest.mock('../../../../src/core/infrastructure/notifier')

describe('Git Reporter Controller should', () => {
  let gitReporterRepository: GitReportImplementationRepository
  let notifierMock: Notifier
  let printerMock: GitReportPrinter

  beforeEach(() => {
    container.clearInstances()
    const commandMock = container.resolve(Shell)
    commandMock.run = async () => rawGitLog
    container.registerInstance(Shell, commandMock)

    gitReporterRepository = container.resolve(GitReportImplementationRepository)
    gitReporterRepository.readGitProjects = jest.fn(async () => ['irrelevant'])
    container.registerInstance(GitReportImplementationRepository, gitReporterRepository)

    notifierMock = container.resolve(Notifier)
    printerMock = container.resolve(GitReportPrinter)
    printerMock.generateProgressBar = () => ({
      start: noop,
      value: 0,
      total: 0,
      increment: noop,
      stop: noop,
    })
    container.registerInstance(GitReportPrinter, printerMock)
  })

  describe('print compact report', () => {
    it('print report for all the given projects', async () => {
      await new GitReportController(notifierMock, printerMock)
      .exec({
        directory: '',
        anonymize: false,
        projects: ['irrelevant'],
        verbose: false,
        weeks: 4,
        slackUrl: 'irrelevant',
      })

      expect(printerMock.info).toHaveBeenCalledWith(expectedReportCompactOutput)
    })

    it('print anonymized report for all the given projects', async () => {
      await container.resolve(GitReportController)
      .exec({
        directory: '',
        anonymize: true,
        projects: ['irrelevant'],
        verbose: false,
        weeks: 4,
        slackUrl: 'irrelevant',
      })

      expect(printerMock.info).not.toHaveBeenCalledWith(expectedReportCompactOutput)
    })

    it('print report for all the projects inside the given directory', async () => {
      await new GitReportController(notifierMock, printerMock)
      .exec({
        directory: 'path/irrelevant',
        anonymize: false,
        projects: [],
        verbose: false,
        weeks: 4,
        slackUrl: 'irrelevant',
      })

      expect(printerMock.info).toHaveBeenCalledWith(expectedReportCompactOutput)
    })

    it('print anonymized report for all the projects inside the given directory', async () => {
      await new GitReportController(notifierMock, printerMock)
      .exec({
        directory: 'path/irrelevant',
        anonymize: true,
        projects: [],
        verbose: false,
        weeks: 4,
        slackUrl: 'irrelevant',
      })

      // TODO: Improve this test
      expect(printerMock.info).not.toHaveBeenCalledWith(expectedReportCompactOutput)
    })
  })

  describe('print verbose report', () => {
    it('print report for all the given projects', async () => {
      await new GitReportController(notifierMock, printerMock)
      .exec({
        directory: '',
        anonymize: false,
        projects: ['irrelevant'],
        verbose: true,
        weeks: 4,
        slackUrl: 'irrelevant',
      })

      expect(printerMock.info).toHaveBeenCalledWith(expectedReportVerboseOutput)
    })

    it('print anonymized report for all the given projects', async () => {
      await container.resolve(GitReportController)
      .exec({
        directory: '',
        anonymize: true,
        projects: ['irrelevant'],
        verbose: true,
        weeks: 4,
        slackUrl: 'irrelevant',
      })

      expect(printerMock.info).not.toHaveBeenCalledWith(expectedReportVerboseOutput)
    })

    it('print report for all the projects inside the given directory', async () => {
      await new GitReportController(notifierMock, printerMock)
      .exec({
        directory: 'path/irrelevant',
        anonymize: false,
        projects: [],
        verbose: true,
        weeks: 4,
        slackUrl: 'irrelevant',
      })

      expect(printerMock.info).toHaveBeenCalledWith(expectedReportVerboseOutput)
    })

    it('print anonymized report for all the projects inside the given directory', async () => {
      await new GitReportController(notifierMock, printerMock)
      .exec({
        directory: 'path/irrelevant',
        anonymize: true,
        projects: [],
        verbose: true,
        weeks: 4,
        slackUrl: 'irrelevant',
      })

      // TODO: Improve this test
      expect(printerMock.info).not.toHaveBeenCalledWith(expectedReportVerboseOutput)
    })
  })

  it('print there is no projects to generate report if no git repository is found in the given directory', async () => {
    gitReporterRepository.readGitProjects = jest.fn(async () => [])

    await new GitReportController(notifierMock, printerMock)
    .exec({
      directory: 'path/irrelevant',
      anonymize: true,
      projects: [],
      verbose: false,
      weeks: 4,
      slackUrl: 'irrelevant',
    })

    expect(printerMock.info).toHaveBeenCalledWith('[33m⚠️  There are no git projects to report.[39m')
  })

  it('notify report on slack', async () => {
    await new GitReportController(notifierMock, printerMock)
    .exec({
      directory: '',
      anonymize: false,
      projects: ['irrelevant'],
      verbose: false,
      weeks: 4,
      slackUrl: 'irrelevant',
    })

    expect(notifierMock.publishOnSlack).toBeCalledWith('irrelevant', expectedReportCompactOutput)
    expect(printerMock.info).toHaveBeenCalledWith('Report published on Slack.')
  })

  it('not notify report on slack if slack url is an empty string', async () => {
    await new GitReportController(notifierMock, printerMock)
    .exec({
      directory: '',
      anonymize: false,
      projects: ['irrelevant'],
      verbose: false,
      weeks: 4,
      slackUrl: '',
    })

    expect(notifierMock.publishOnSlack).not.toBeCalled()
  })
})
