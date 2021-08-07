import { CommitterInfo } from '../../src/gitReport/domain/gitReport'

export function buildCommitterInfo (committer: Partial<CommitterInfo> = {}): CommitterInfo {
  return {
    email: committer.email ?? 'fake@email.com',
    name: committer.name ?? 'Bruce Wayne',
    totalCommits: committer.totalCommits ?? 1,
    totalDeletions: committer.totalDeletions ?? 1,
    totalFilesChanged: committer.totalFilesChanged ?? 1,
    totalInsertions: committer.totalInsertions ?? 1
  }
}
