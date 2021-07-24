import { GitReportService } from '../../src/gitReport/domain/gitReport.service'
import {
  expectedReport,
  expectedReportForMultipleRepositories,
  rawGitLog
} from '../fixture'
import { container } from 'tsyringe'
import { GitReportRepository } from '../../src/gitReport/infrastructure/gitReport.repository'
import { Logger } from '../../src/logger'
import { Command } from '../../src/command'

describe('Git Reporter Service should', () => {
  let gitReporterRepository: GitReportRepository
  let loggerMock: Logger

  beforeEach(() => {
    container.clearInstances()
    const commandMock = container.resolve(Command)
    commandMock.run = async () => rawGitLog
    container.registerInstance(Command, commandMock)
    loggerMock = container.resolve(Logger)
    loggerMock.info = jest.fn()
    loggerMock.error = jest.fn()
    container.registerInstance(Logger, loggerMock)
    gitReporterRepository = container.resolve(GitReportRepository)
    gitReporterRepository.readGitProjects = jest.fn(async () => ['irrelevant'])
  })

  describe('generate a git report based on project paths', () => {
    it('retrieve total commits', async () => {
      const report = await new GitReportService(gitReporterRepository)
        .generateReport(['path/irrelevant'], 4)

      expect(report.totalCommits).toBe(expectedReport.totalCommits)
    })

    it('retrieve total commits, files changed, insertions and deletions for each committer', async () => {
      const report = await new GitReportService(gitReporterRepository)
        .generateReport(['path/irrelevant'], 4)

      expect(report.committers).toStrictEqual(expectedReport.committers)
    })

    it('retrieve the amount of weeks used for generating the report', async () => {
      const report = await new GitReportService(gitReporterRepository)
        .generateReport(['path/irrelevant'], 4)

      expect(report.weeks).toBe(expectedReport.weeks)
    })

    it('retrieve the projects used for generating the report', async () => {
      const report = await new GitReportService(gitReporterRepository)
        .generateReport(['path/irrelevant'], 4)

      expect(report.projects).toStrictEqual(expectedReport.projects)
    })

    it('anonymize committers personal data', async () => {
      const report = await new GitReportService(gitReporterRepository)
        .generateAnonymousReport(['path/irrelevant'], 4)

      expect(report.totalCommits).toBe(expectedReport.totalCommits)
      for (const [index, anonymizedCommitter] of report.committers.entries()) {
        expect(anonymizedCommitter.totalCommits).toBe(expectedReport.committers[index].totalCommits)
        expect(anonymizedCommitter.email).not.toBe(expectedReport.committers[index].email)
        expect(anonymizedCommitter.name).not.toBe(expectedReport.committers[index].name)
      }
    })

    it('process multiple repositories', async () => {
      const report = await new GitReportService(gitReporterRepository)
        .generateReport(['path/irrelevant', 'path/irrelevant'], 4)

      expect(report).toStrictEqual(expectedReportForMultipleRepositories)
    })

    it('not fail if no projects are given', async () => {
      const report = await new GitReportService(gitReporterRepository)
        .generateReport([], 4)

      expect(report.totalCommits).toBe(0)
      expect(report.committers).toStrictEqual([])
    })
  })

  describe('generate a git report reading all git projects in a directory', () => {
    it('retrieve total commits', async () => {
      const report = await new GitReportService(gitReporterRepository)
        .generateReportForAllProjectsInADirectory('path/irrelevant', 4)

      expect(report.totalCommits).toBe(expectedReport.totalCommits)
    })

    it('retrieve total commits for each committer', async () => {
      const report = await new GitReportService(gitReporterRepository)
        .generateReportForAllProjectsInADirectory('path/irrelevant', 4)

      expect(report.committers).toStrictEqual(expectedReport.committers)
    })

    it('retrieve the amount of weeks used for generating the report', async () => {
      const report = await new GitReportService(gitReporterRepository)
        .generateReportForAllProjectsInADirectory('path/irrelevant', 4)

      expect(report.weeks).toBe(expectedReport.weeks)
    })

    it('retrieve the projects used for generating the report', async () => {
      const report = await new GitReportService(gitReporterRepository)
        .generateReportForAllProjectsInADirectory('path/irrelevant', 4)

      expect(report.projects).toStrictEqual(expectedReport.projects)
    })

    it('retrieve anonymized report', async () => {
      const report = await new GitReportService(gitReporterRepository)
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
