import { GitReporterService } from './gitReporter.service'
import {
  expectedReport,
  expectedReportForMultipleRepositories,
  rawGitLog
} from './fixture'
import { container } from 'tsyringe'
import { GitReporterRepository } from './gitReporter.repository'

describe('Git Reporter should', () => {
  let gitReporterRepository: GitReporterRepository
  beforeEach(() => {
    container.clearInstances()
    gitReporterRepository = container.resolve(GitReporterRepository)
    gitReporterRepository.readGitLog = jest.fn(async () => rawGitLog)
  })

  it('retrieve total commits', async () => {
    const report = await new GitReporterService(gitReporterRepository)
      .exec(['irrelevantPath'])

    expect(report.totalCommits).toBe(expectedReport.totalCommits)
  })

  it('retrieve total commits for each committer', async () => {
    const report = await new GitReporterService(gitReporterRepository)
      .exec(['irrelevantPath'])

    expect(report.committers).toStrictEqual(expectedReport.committers)
  })

  it('process multiple repositories', async () => {
    const report = await new GitReporterService(gitReporterRepository)
      .exec(['irrelevantPath', 'irrelevantPath'])

    expect(report.totalCommits).toBe(expectedReportForMultipleRepositories.totalCommits)
    expect(report.committers).toStrictEqual(expectedReportForMultipleRepositories.committers)
  })

  it('not fail no repository is added', async () => {
    const report = await new GitReporterService(gitReporterRepository)
      .exec([])

    expect(report.totalCommits).toBe(0)
    expect(report.committers).toStrictEqual([])
  })
})
