import { expectedProjects, expectedReport, rawGitLog, rawProjectList } from '@test/fixtures'
import { GitReportList } from '@gitReport/domain/gitReportList'
import { Command } from '@core/infrastructure/command'
import { GitReportRepository } from '@gitReport/infrastructure/gitReport.repository'
import { Logger } from '@core/infrastructure/logger'

describe('Git Report Repository should', () => {
  const logger = new Logger()
  logger.info = jest.fn()
  logger.error = jest.fn()

  it('retrieve a list of git reports', async () => {
    const expectedReports = new GitReportList([expectedReport, expectedReport])
    const projectPath = 'irrelevant'
    const weeks = 4
    const command = new Command()
    command.run = async () => rawGitLog
    const repository = new GitReportRepository(command, logger)

    const reports = await repository.readGitReports([projectPath, projectPath], weeks)

    expect(reports).toEqual(expectedReports)
    expect(logger.info).toHaveBeenCalledWith(`(1/2) Read git log for ${projectPath}`)
    expect(logger.info).toHaveBeenCalledWith(`(2/2) Read git log for ${projectPath}`)
  })

  it('retrieve an empty list of git reports if there is not git projects for the given directories', async () => {
    const expectedReports = new GitReportList([])
    const projectPath = 'irrelevant'
    const weeks = 4
    const command = new Command()
    command.run = async () => {
      throw new Error('Command failed')
    }
    const repository = new GitReportRepository(command, logger)

    const reports = await repository.readGitReports([projectPath, projectPath], weeks)

    expect(reports).toEqual(expectedReports)
    expect(logger.error).toHaveBeenCalledWith('(1/2) 💥 Error reading git log for irrelevant. More info about the error below:')
    expect(logger.error).toHaveBeenCalledWith('(2/2) 💥 Error reading git log for irrelevant. More info about the' +
      ' error below:')
    expect(logger.error).toHaveBeenCalledWith('Command failed')
  })

  it('retrieve a list of git projects paths', async () => {
    const projectPath = 'irrelevant'
    const command = new Command()
    command.run = async () => rawProjectList
    const repository = new GitReportRepository(command, logger)

    const projects = await repository.readGitProjects(projectPath)

    expect(projects).toEqual(expectedProjects)
  })

  it('retrieve an empty list of git projects paths if there is no one in the given repository', async () => {
    const projectPath = 'irrelevant'
    const command = new Command()
    command.run = async () => '\nzsh: no matches found: /*/.git'
    const repository = new GitReportRepository(command, logger)

    const projects = await repository.readGitProjects(projectPath)

    expect(projects).toEqual([])
  })
})
