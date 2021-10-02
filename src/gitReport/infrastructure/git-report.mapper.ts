import {EOL} from 'os'
import path from 'path'
import {CommitterInfo, GitReport} from '../domain/git-report'

interface ContributorsStats {
  stats: string[],
  totalCommits: number
}

export class GitReportMapper {
  static toDomain(gitLog: string, weeks: number, projectPath: string): GitReport {
    const contributors = gitLog.split(EOL.concat(EOL)).filter(Boolean)
    return new GitReport({
      weeks,
      projects: [GitReportMapper.extractProjectName(projectPath)],
      committers: GitReportMapper.extractCommittersInfo(contributors),
    })
  }

  private static extractProjectName(projectPath: string): string {
    const absolutePath = path.resolve(projectPath)
    return absolutePath.slice(absolutePath.lastIndexOf('/') + 1)
  }

  private static extractCommittersInfo(gitLogStats: string[]): CommitterInfo[] {
    const contributorsStats = GitReportMapper.extractContributorsStats(gitLogStats)
    return Object.entries(contributorsStats).map(GitReportMapper.generateCommitterInfo)
  }

  private static generateCommitterInfo([contributor, {totalCommits, stats}]: [string, ContributorsStats]): CommitterInfo {
    return ({
      ...GitReportMapper.extractContributorInfo(contributor),
      ...GitReportMapper.extractStats(stats),
      totalCommits,
    })
  }

  private static extractContributorsStats(gitLogStats: string[]): Record<string, ContributorsStats> {
    return gitLogStats.reduce((contributorsStats: Record<string, ContributorsStats>, gitLogStat: string) => {
      const [contributor, stats] = gitLogStat.split(EOL)
      return {
        ...contributorsStats,
        [contributor]: {
          stats: [...(contributorsStats[contributor]?.stats || []), stats],
          totalCommits: (contributorsStats[contributor]?.totalCommits || 0) + 1,
        },
      }
    },
    {})
  }

  private static extractContributorInfo(contributor: string): Pick<CommitterInfo, 'name' | 'email'> {
    const [name, email] = contributor.split('|')
    return {
      name: String(name).trim(),
      email: String(email).trim(),
    }
  }

  private static extractStats(stats: string[]): Pick<CommitterInfo, 'totalFilesChanged' | 'totalInsertions' | 'totalDeletions'> {
    return stats.reduce((acc, stat) => {
      const filesChanged = GitReportMapper.parseStat('files? changed', stat)
      const insertions = GitReportMapper.parseStat('insertions?', stat)
      const deletions = GitReportMapper.parseStat('deletions?', stat)
      return {
        totalFilesChanged: filesChanged + acc.totalFilesChanged,
        totalInsertions: insertions + acc.totalInsertions,
        totalDeletions: deletions + acc.totalDeletions,
      }
    }, {
      totalFilesChanged: 0,
      totalInsertions: 0,
      totalDeletions: 0,
    })
  }

  private static parseStat(regExp: string, stat: string): number {
    const extractedStat = new RegExp(`\\d+ ${regExp}`).exec(stat)
    if (extractedStat) {
      const stat = /\d+/.exec(extractedStat[0]) as RegExpExecArray
      return Number(stat[0])
    }
    return 0
  }
}
