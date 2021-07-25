import { Logger } from '../../src/logger'
import { Command } from '../../src/command'
import { expectedProjects, expectedReport, rawGitLog, rawProjectList } from '../fixtures'
import { GitReportRepository } from '../../src/gitReport/infrastructure/gitReport.repository'
import { GitReportList } from '../../src/gitReport/domain/gitReportList'

describe('Git Report Repository should', () => {
  const logger = new Logger()
  logger.info = jest.fn()

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

  it('retrieve a list of git projects paths', async () => {
    const projectPath = 'irrelevant'
    const command = new Command()
    command.run = async () => rawProjectList
    const repository = new GitReportRepository(command, logger)

    const projects = await repository.readGitProjects(projectPath)

    expect(projects).toEqual(expectedProjects)
  })
})
