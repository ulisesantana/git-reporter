import faker from 'faker'

export interface CommitterInfo {
  name: string
  email: string
  totalFilesChanged: number
  totalInsertions: number
  totalDeletions: number
  totalCommits: number
}

export interface GitReport {
  totalCommits: number
  committers: CommitterInfo[]
  weeks: number,
  project: string,
}

export type AccumulatedGitReport = Omit<GitReport, 'project'> & {
  projects: string[]
}

export class GitReporter {
  static generateAccumulatedGitReport (reports: GitReport[]): AccumulatedGitReport {
    return reports.reduce<AccumulatedGitReport>((acc, report) => ({
      weeks: report.weeks,
      projects: [...acc.projects, report.project],
      committers: GitReporter.combineCommitters(acc.committers, report.committers),
      totalCommits: acc.totalCommits + report.totalCommits
    }), {
      weeks: 0,
      totalCommits: 0,
      committers: [],
      projects: []
    } as AccumulatedGitReport)
  }

  static anonymizeAccumulatedGitReport (report: AccumulatedGitReport): AccumulatedGitReport {
    return {
      ...report,
      committers: report.committers.map(committer => ({
        ...committer,
        email: faker.internet.email(),
        name: faker.name.findName()
      }))
    }
  }

  private static combineCommitters (accCommitters: CommitterInfo[], committers: CommitterInfo[]): CommitterInfo[] {
    return Object.values([...accCommitters, ...committers].reduce<Record<string, CommitterInfo>>(
      (committersDictionary, committer) => {
        const accumulatedCommitterInfo = GitReporter.getCommitter(committer.email, committersDictionary)
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
