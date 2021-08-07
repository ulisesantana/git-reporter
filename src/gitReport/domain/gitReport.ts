import faker from 'faker'

export interface CommitterInfo {
  name: string
  email: string
  totalFilesChanged: number
  totalInsertions: number
  totalDeletions: number
  totalCommits: number
}

interface GitReportBase {
  committers: CommitterInfo[]
  weeks: number,
  projects: string[],
}

interface GitReportTotals {
  totalCommits: number
  totalFilesChanged: number
  totalInsertions: number
  totalDeletions: number
}

export class GitReport {
  public readonly committers: CommitterInfo[]
  public readonly weeks: number
  public readonly projects: string[]

  public readonly totalCommits: number
  public readonly totalFilesChanged: number
  public readonly totalInsertions: number
  public readonly totalDeletions: number

  constructor ({ committers, weeks, projects }: GitReportBase) {
    const totals = GitReport.computeTotals(committers)
    this.committers = GitReport.sortCommittersByTotalCommitsDesc(committers)
    this.weeks = weeks
    this.projects = projects
    this.totalCommits = totals.totalCommits
    this.totalDeletions = totals.totalDeletions
    this.totalFilesChanged = totals.totalFilesChanged
    this.totalInsertions = totals.totalInsertions
  }

  anonymize (): GitReport {
    return new GitReport({
      weeks: this.weeks,
      projects: this.projects,
      committers: this.committers.map(committer => ({
        ...committer,
        email: faker.internet.email(),
        name: faker.name.findName()
      }))
    })
  }

  private static sortCommittersByTotalCommitsDesc (committers: CommitterInfo[]): CommitterInfo[] {
    return [...committers].sort((a, b) => {
      return GitReport.computeContributionScore(b) - GitReport.computeContributionScore(a) || a.name.localeCompare(b.name)
    })
  }

  private static computeTotals (committers: CommitterInfo[]): GitReportTotals {
    return committers.reduce<GitReportTotals>((totals, committerInfo) => ({
      totalCommits: totals.totalCommits + committerInfo.totalCommits,
      totalDeletions: totals.totalDeletions + committerInfo.totalDeletions,
      totalFilesChanged: totals.totalFilesChanged + committerInfo.totalFilesChanged,
      totalInsertions: totals.totalInsertions + committerInfo.totalInsertions
    }), {
      totalCommits: 0,
      totalDeletions: 0,
      totalFilesChanged: 0,
      totalInsertions: 0
    })
  }

  private static computeContributionScore ({ totalCommits, totalFilesChanged, totalInsertions, totalDeletions }: CommitterInfo): number {
    return totalCommits + totalFilesChanged + totalInsertions + totalDeletions
  }
}
