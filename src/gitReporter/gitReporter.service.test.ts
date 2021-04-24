import { GitReporterService } from './gitReporter.service'
import {
  expectedReport,
  expectedReportForMultipleRepositories,
  rawGitLog
} from './fixture'
import { container } from 'tsyringe'
import { GitReporterRepository } from './gitReporter.repository'

describe('Git Reporter Service should', () => {
  let gitReporterRepository: GitReporterRepository
  beforeEach(() => {
    container.clearInstances()
    gitReporterRepository = container.resolve(GitReporterRepository)
    gitReporterRepository.readGitLog = jest.fn(async () => rawGitLog)
  })

  it('retrieve total commits', async () => {
    const report = await new GitReporterService(gitReporterRepository)
      .generateReport(['irrelevantPath'])

    expect(report.totalCommits).toBe(expectedReport.totalCommits)
  })

  it('retrieve total commits for each committer', async () => {
    const report = await new GitReporterService(gitReporterRepository)
      .generateReport(['irrelevantPath'])

    expect(report.committers).toStrictEqual(expectedReport.committers)
  })

  it('retrieve anonymized report', async () => {
    const report = await new GitReporterService(gitReporterRepository)
      .generateAnonymousReport(['irrelevantPath'])

    expect(report.totalCommits).toBe(expectedReport.totalCommits)
    for (const [index, anonymizedCommitter] of report.committers.entries()) {
      expect(anonymizedCommitter.totalCommits).toBe(expectedReport.committers[index].totalCommits)
      expect(anonymizedCommitter.email).not.toBe(expectedReport.committers[index].email)
      expect(anonymizedCommitter.name).not.toBe(expectedReport.committers[index].name)
    }
  })

  it('process multiple repositories', async () => {
    const report = await new GitReporterService(gitReporterRepository)
      .generateReport(['irrelevantPath', 'irrelevantPath'])

    expect(report.totalCommits).toBe(expectedReportForMultipleRepositories.totalCommits)
    expect(report.committers).toStrictEqual(expectedReportForMultipleRepositories.committers)
  })

  it('not fail if no projects are given', async () => {
    const report = await new GitReporterService(gitReporterRepository)
      .generateReport([])

    expect(report.totalCommits).toBe(0)
    expect(report.committers).toStrictEqual([])
  })
})
