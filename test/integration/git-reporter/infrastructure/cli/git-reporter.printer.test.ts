import {GitReportPrinter} from '../../../../../src/git-report/infrastructure/cli/git-report.printer'
import {container} from 'tsyringe'
import {Logger} from '../../../../../src/core/infrastructure/logger'
import {red, underline} from 'colorette'
import version from '../../../../../src/version'
import {EOL} from 'os'
import {FailedGitReport} from '../../../../../src/git-report/domain/git-report'
import path from 'path'

describe('GitReportPrinter should', () => {
  const logger = container.resolve(Logger)

  beforeEach(() => {
    logger.info = jest.fn()
    logger.error = jest.fn()
  })

  it('log info level', () => {
    const message = 'irrelevant'

    new GitReportPrinter(logger).info(message)

    expect(logger.info).toHaveBeenCalledWith(message)
    expect(logger.error).not.toBeCalled()
  })

  it('log error level', () => {
    const message = 'irrelevant'

    new GitReportPrinter(logger).error(message)

    expect(logger.error).toHaveBeenCalledWith(message)
    expect(logger.info).not.toBeCalled()
  })

  it('return a printable progress bar', () => {
    const printer = new GitReportPrinter(logger)
    const progress = printer.generateProgressBar('test')

    progress.start(2, 1)

    expect(progress.value).toBe(1)
    expect(progress.total).toBe(2)

    progress.increment()

    expect(progress.value).toBe(2)

    progress.stop()
  })

  it('print script initialization', () => {
    new GitReportPrinter(logger).printInit()

    expect(logger.info).toHaveBeenCalledWith(underline(`Initializing git reporter ${version}${EOL}`))
  })

  it('print start fetching for projects in directory message', () => {
    const pathToDirectory = '.'
    new GitReportPrinter(logger).printStartFetchingDirectory(pathToDirectory)

    expect(logger.info).toHaveBeenCalledWith(`🔍 Starting to fetch git logs for projects in directory ${
      path.resolve(pathToDirectory)
    }.${EOL}`)
  })

  it('print start fetching for projects', () => {
    const paths = ['src', 'test']
    new GitReportPrinter(logger).printStartFetchingProjects(paths)

    expect(logger.info).toHaveBeenCalledWith(`🔍 Starting to fetch git logs for: ${
      EOL}  - src${EOL}  - test${EOL}`)
  })

  it('print failed reports', () => {
    new GitReportPrinter(logger).printFailedReports([
      new FailedGitReport(['irrelevant', 'irrelevant2']),
      new FailedGitReport(['irrelevant3']),
    ])

    expect(logger.error).toHaveBeenCalledWith(`${EOL}🚨 The following projects failed to get git log:`)
    expect(logger.error).toHaveBeenCalledWith(`  - ${red('irrelevant')}${EOL}  - ${red('irrelevant2')}`)
    expect(logger.error).toHaveBeenCalledWith(`  - ${red('irrelevant3')}`)
  })
})
