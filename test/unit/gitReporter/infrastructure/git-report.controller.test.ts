import {container} from 'tsyringe'
import {
  expectedReportCompactOutput,
  expectedReportVerboseOutput,
  expectedUpdatedReportCompactOutput,
  rawGitLog,
} from '../../../fixtures'
import {Shell} from '../../../../src/core/infrastructure/shell'
import {GitReportImplementationRepository} from '../../../../src/git-report/infrastructure/git-report.implementation.repository'
import {GitReportController} from '../../../../src/git-report/infrastructure/git-report.controller'
import {Notifier} from '../../../../src/core/infrastructure/notifier'
import {noop} from '../../../noop'
import path from 'path'
import {GitReportCliPrinter} from '../../../../src/git-report/infrastructure/cli/git-report.cli.printer'
import {GitReportPrinter} from '../../../../src/git-report/application/git-report.printer'

jest.mock('../../../../src/git-report/infrastructure/cli/git-report.cli.printer')
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
    printerMock = container.resolve(GitReportCliPrinter)
    printerMock.generateProgressBar = () => ({
      start: noop,
      value: 0,
      total: 0,
      increment: noop,
      stop: noop,
    })
    container.registerInstance(GitReportCliPrinter, printerMock)
  })

  it('print compact report', async () => {
    await new GitReportController(notifierMock, printerMock)
    .exec({
      directory: '',
      anonymize: false,
      forceUpdate: false,
      projects: ['irrelevant'],
      verbose: false,
      weeks: 4,
      slackUrl: 'irrelevant',
    })

    expect(printerMock.info).toHaveBeenCalledWith(expectedReportCompactOutput)
  })

  it('print udpated report', async () => {
    const readGitReportSpy = jest.spyOn(gitReporterRepository, 'readGitReport')

    await new GitReportController(notifierMock, printerMock)
    .exec({
      directory: '',
      anonymize: false,
      forceUpdate: true,
      projects: ['irrelevant'],
      verbose: false,
      weeks: 4,
      slackUrl: 'irrelevant',
    })

    expect(printerMock.info).toHaveBeenCalledWith(expectedUpdatedReportCompactOutput)
    expect(readGitReportSpy).toHaveBeenCalledWith({projectPath: path.resolve('irrelevant'), weeks: 4, updateBeforeRead: true})
  })

  it('print report for all the given projects', async () => {
    await new GitReportController(notifierMock, printerMock)
    .exec({
      directory: '',
      anonymize: false,
      forceUpdate: false,
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
      forceUpdate: false,
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
      forceUpdate: false,
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
      forceUpdate: false,
      projects: [],
      verbose: false,
      weeks: 4,
      slackUrl: 'irrelevant',
    })

    // TODO: Improve this test
    expect(printerMock.info).not.toHaveBeenCalledWith(expectedReportCompactOutput)
  })

  it('print verbose report', async () => {
    await new GitReportController(notifierMock, printerMock)
    .exec({
      directory: '',
      anonymize: false,
      forceUpdate: false,
      projects: ['irrelevant'],
      verbose: true,
      weeks: 4,
      slackUrl: 'irrelevant',
    })

    expect(printerMock.info).toHaveBeenCalledWith(expectedReportVerboseOutput)
  })

  it('print there is no projects to generate report if no git repository is found in the given directory', async () => {
    gitReporterRepository.readGitProjects = jest.fn(async () => [])

    await new GitReportController(notifierMock, printerMock)
    .exec({
      directory: 'path/irrelevant',
      anonymize: true,
      forceUpdate: false,
      projects: [],
      verbose: false,
      weeks: 4,
      slackUrl: 'irrelevant',
    })

    expect(printerMock.info).toHaveBeenCalledWith(`[33m⚠️  There are no git projects to report.[39m

⚠️  The report could be outdated due to has been generated without updating git projects. Use --forceUpdate (-f) option for updating projects before generating the report.`)
  })

  it('notify report on slack', async () => {
    await new GitReportController(notifierMock, printerMock)
    .exec({
      anonymize: false,
      directory: '',
      forceUpdate: false,
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
      anonymize: false,
      directory: '',
      forceUpdate: false,
      projects: ['irrelevant'],
      verbose: false,
      weeks: 4,
      slackUrl: '',
    })

    expect(notifierMock.publishOnSlack).not.toBeCalled()
  })
})
