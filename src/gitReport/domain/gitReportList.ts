import { CommitterInfo, GitReport } from './gitReport'

/**
 * Inmutable list of git reports
 */
export class GitReportList {
  constructor (private values: GitReport[]) {}

  getGitReports (): GitReport[] {
    return [...this.values]
  }

  mergeReports (): GitReport {
    return this.getGitReports().reduce<GitReport>(
      (acc, report) => new GitReport({
        weeks: report.weeks,
        projects: [...acc.projects, ...report.projects],
        committers: GitReportList.combineCommitters(acc.committers, report.committers)
      }),
      new GitReport({ committers: [], projects: [], weeks: 0 })
    )
  }

  private static combineCommitters (accCommitters: CommitterInfo[], committers: CommitterInfo[]): CommitterInfo[] {
    return Object.values([...accCommitters, ...committers].reduce<Record<string, CommitterInfo>>(
      (committersDictionary, committer) => {
        const accumulatedCommitterInfo = GitReportList.getCommitter(committer.email, committersDictionary)
        return {
          ...committersDictionary,
          [committer.email]: {
            email: committer.email,
            name: committer.name,
            totalDeletions: committer.totalDeletions + accumulatedCommitterInfo.totalDeletions,
            totalInsertions: committer.totalInsertions + accumulatedCommitterInfo.totalInsertions,
            totalCommits: committer.totalCommits + accumulatedCommitterInfo.totalCommits,
            totalFilesChanged: committer.totalFilesChanged + accumulatedCommitterInfo.totalFilesChanged
          }
        }
      },
      {} as Record<string, CommitterInfo>
    ))
  }

  private static getCommitter (committerEmail: string, committersDictionary: Record<string, CommitterInfo>): CommitterInfo {
    const committer = committersDictionary[committerEmail]
    return committer || {
      email: committerEmail,
      name: '',
      totalDeletions: 0,
      totalInsertions: 0,
      totalCommits: 0,
      totalFilesChanged: 0
    }
  }
}
