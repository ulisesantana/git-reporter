import { GitReporterService } from './gitReporter.service'
import {
  expectedReport,
  expectedReportForMultipleRepositories,
  rawGitLog
} from './fixture'
import { container } from 'tsyringe'
import { GitReporterRepository } from './gitReporter.repository'
import { Logger } from '../logger'

describe('Git Reporter Service should', () => {
  let gitReporterRepository: GitReporterRepository
  let loggerMock: Logger

  beforeEach(() => {
    container.clearInstances()
    gitReporterRepository = container.resolve(GitReporterRepository)
    gitReporterRepository.readGitLog = jest.fn(async () => rawGitLog)
    gitReporterRepository.readGitProjects = jest.fn(async () => ['irrelevant'])

    loggerMock = container.resolve(Logger)
    loggerMock.info = jest.fn()
    loggerMock.error = jest.fn()
  })

  describe('generate a git report based on project paths', () => {
    it('retrieve total commits', async () => {
      const report = await new GitReporterService(gitReporterRepository, loggerMock)
        .generateReport(['path/irrelevant'], 4)

      expect(report.totalCommits).toBe(expectedReport.totalCommits)
    })

    it('retrieve total commits, files changed, insertions and deletions for each committer', async () => {
      const report = await new GitReporterService(gitReporterRepository, loggerMock)
        .generateReport(['path/irrelevant'], 4)

      expect(report.committers).toStrictEqual(expectedReport.committers)
    })

    it('retrieve the amount of weeks used for generating the report', async () => {
      const report = await new GitReporterService(gitReporterRepository, loggerMock)
        .generateReport(['path/irrelevant'], 4)

      expect(report.weeks).toBe(expectedReport.weeks)
    })

    it('retrieve the projects used for generating the report', async () => {
      const report = await new GitReporterService(gitReporterRepository, loggerMock)
        .generateReport(['path/irrelevant'], 4)

      expect(report.projects).toStrictEqual(expectedReport.projects)
    })

    it('anonymize committers personal data', async () => {
      const report = await new GitReporterService(gitReporterRepository, loggerMock)
        .generateAnonymousReport(['path/irrelevant'], 4)

      expect(report.totalCommits).toBe(expectedReport.totalCommits)
      for (const [index, anonymizedCommitter] of report.committers.entries()) {
        expect(anonymizedCommitter.totalCommits).toBe(expectedReport.committers[index].totalCommits)
        expect(anonymizedCommitter.email).not.toBe(expectedReport.committers[index].email)
        expect(anonymizedCommitter.name).not.toBe(expectedReport.committers[index].name)
      }
    })

    it('process multiple repositories', async () => {
      const report = await new GitReporterService(gitReporterRepository, loggerMock)
        .generateReport(['path/irrelevant', 'path/irrelevant'], 4)

      expect(report).toStrictEqual(expectedReportForMultipleRepositories)
    })

    it('not fail if no projects are given', async () => {
      const report = await new GitReporterService(gitReporterRepository, loggerMock)
        .generateReport([], 4)

      expect(report.totalCommits).toBe(0)
      expect(report.committers).toStrictEqual([])
    })
  })

  describe('generate a git report reading all git projects in a directory', () => {
    it('retrieve total commits', async () => {
      const report = await new GitReporterService(gitReporterRepository, loggerMock)
        .generateReportForAllProjectsInADirectory('path/irrelevant', 4)

      expect(report.totalCommits).toBe(expectedReport.totalCommits)
    })

    it('retrieve total commits for each committer', async () => {
      const report = await new GitReporterService(gitReporterRepository, loggerMock)
        .generateReportForAllProjectsInADirectory('path/irrelevant', 4)

      expect(report.committers).toStrictEqual(expectedReport.committers)
    })

    it('retrieve the amount of weeks used for generating the report', async () => {
      const report = await new GitReporterService(gitReporterRepository, loggerMock)
        .generateReportForAllProjectsInADirectory('path/irrelevant', 4)

      expect(report.weeks).toBe(expectedReport.weeks)
    })

    it('retrieve the projects used for generating the report', async () => {
      const report = await new GitReporterService(gitReporterRepository, loggerMock)
        .generateReportForAllProjectsInADirectory('path/irrelevant', 4)

      expect(report.projects).toStrictEqual(expectedReport.projects)
    })

    it('retrieve anonymized report', async () => {
      const report = await new GitReporterService(gitReporterRepository, loggerMock)
        .generateAnonymousReportForAllProjectsInADirectory('path/irrelevant', 4)

      expect(report.totalCommits).toBe(expectedReport.totalCommits)
      for (const [index, anonymizedCommitter] of report.committers.entries()) {
        expect(anonymizedCommitter.totalCommits).toBe(expectedReport.committers[index].totalCommits)
        expect(anonymizedCommitter.email).not.toBe(expectedReport.committers[index].email)
        expect(anonymizedCommitter.name).not.toBe(expectedReport.committers[index].name)
      }
    })
  })
})
