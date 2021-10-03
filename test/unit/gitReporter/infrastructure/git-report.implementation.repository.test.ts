import {expectedProjects, expectedReport, rawGitLog, rawProjectList} from '../../../fixtures'
import {Shell} from '../../../../src/core/infrastructure/shell'
import {GitReportImplementationRepository} from '../../../../src/git-report/infrastructure/git-report.implementation.repository'
import {FailedGitReport} from '../../../../src/git-report/domain/git-report'
import path from 'path'

describe('Git Report Repository should', () => {
  it('retrieve a git report', async () => {
    const projectPath = 'irrelevant'
    const weeks = 4
    const command = new Shell()
    command.run = async () => rawGitLog
    const repository = new GitReportImplementationRepository(command)

    const report = await repository.readGitReport({projectPath, weeks, updateBeforeRead: false})

    expect(report).toEqual(expectedReport)
  })

  it('update git repository and retrieve a git report', async () => {
    const projectPath = 'irrelevant'
    const absolutePath = path.resolve(projectPath)
    const weeks = 4
    const command = new Shell()
    command.run = jest.fn(async () => rawGitLog)
    const repository = new GitReportImplementationRepository(command)

    const report = await repository.readGitReport({projectPath, weeks, updateBeforeRead: true})

    expect(report).toEqual(expectedReport)
    expect(command.run).toHaveBeenCalledWith(`git -C ${absolutePath} fetch && git -C ${absolutePath} pull`)
  })

  it('retrieve a failed git report if there is not git projects for the given directories', async () => {
    const failedGitReport = new FailedGitReport(expectedReport.projects)
    const projectPath = 'irrelevant'
    const weeks = 4
    const command = new Shell()
    command.run = async () => {
      throw new Error('Command failed')
    }
    const repository = new GitReportImplementationRepository(command)

    const report = await repository.readGitReport({projectPath, weeks, updateBeforeRead: true})

    expect(report).toEqual(failedGitReport)
  })

  it('retrieve a failed git report if there is not git projects for the given directories', async () => {
    const failedGitReport = new FailedGitReport(expectedReport.projects)
    const projectPath = 'irrelevant'
    const weeks = 4
    const command = new Shell()
    command.run = async () => {
      throw new Error('Command failed')
    }
    const repository = new GitReportImplementationRepository(command)

    const report = await repository.readGitReport({projectPath, weeks, updateBeforeRead: false})

    expect(report).toEqual(failedGitReport)
  })

  it('retrieve a list of git projects paths', async () => {
    const projectPath = 'irrelevant'
    const command = new Shell()
    command.run = async () => rawProjectList
    const repository = new GitReportImplementationRepository(command)

    const projects = await repository.readGitProjects(projectPath)

    expect(projects).toEqual(expectedProjects)
  })

  it('retrieve an empty list of git projects paths if there is no one in the given repository', async () => {
    const projectPath = 'irrelevant'
    const command = new Shell()
    command.run = async () => '\nzsh: no matches found: /*/.git'
    const repository = new GitReportImplementationRepository(command)

    const projects = await repository.readGitProjects(projectPath)

    expect(projects).toEqual([])
  })
})
