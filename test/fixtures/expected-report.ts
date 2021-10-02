import {GitReport} from '../../src/gitReport/domain/git-report'

export const expectedReport: GitReport = {
  weeks: 4,
  projects: ['irrelevant'],
  totalCommits: 13,
  totalFilesChanged: 25,
  totalInsertions: 158,
  totalDeletions: 39,
  committers: [
    {
      email: 'rtrott@gmail.com',
      name: 'Rich Trott',
      totalCommits: 6,
      totalDeletions: 15,
      totalFilesChanged: 16,
      totalInsertions: 84,
    },
    {
      email: 'luigipinca@gmail.com',
      name: 'Luigi Pinca',
      totalCommits: 1,
      totalDeletions: 20,
      totalFilesChanged: 2,
      totalInsertions: 24,
    },
    {
      email: 'jasnell@gmail.com',
      name: 'James M Snell',
      totalCommits: 1,
      totalDeletions: 1,
      totalFilesChanged: 2,
      totalInsertions: 23,
    },
    {
      email: 'arnold.zokas@coderoom.net',
      name: 'Arnold Zokas',
      totalCommits: 1,
      totalDeletions: 0,
      totalFilesChanged: 1,
      totalInsertions: 12,
    },
    {
      email: 'rod@vagg.org',
      name: 'Rod Vagg',
      totalCommits: 1,
      totalDeletions: 0,
      totalFilesChanged: 1,
      totalInsertions: 11,
    },
    {
      email: 'duhamelantoine1995@gmail.com',
      name: 'Antoine du Hamel',
      totalCommits: 1,
      totalDeletions: 2,
      totalFilesChanged: 1,
      totalInsertions: 2,
    },
    {
      email: 'sgallagh@redhat.com',
      name: 'Stephen Gallagher',
      totalCommits: 1,
      totalDeletions: 1,
      totalFilesChanged: 1,
      totalInsertions: 1,
    },
    {
      email: 'rafael.nunu@hotmail.com',
      name: 'Rafael Gonzaga',
      totalCommits: 1,
      totalDeletions: 0,
      totalFilesChanged: 1,
      totalInsertions: 1,
    },
  ],
} as GitReport

export const expectedReportForMultipleRepositories: GitReport = {
  ...expectedReport,
  projects: ['irrelevant', 'irrelevant'],
  totalCommits: expectedReport.totalCommits * 2,
  totalFilesChanged: expectedReport.totalFilesChanged * 2,
  totalInsertions: expectedReport.totalInsertions * 2,
  totalDeletions: expectedReport.totalDeletions * 2,
  committers: expectedReport.committers.map(committer => ({
    email: committer.email,
    name: committer.name,
    totalCommits: committer.totalCommits * 2,
    totalFilesChanged: committer.totalFilesChanged * 2,
    totalInsertions: committer.totalInsertions * 2,
    totalDeletions: committer.totalDeletions * 2,
  })),
} as GitReport

export const expectedReportOutput = `
Report for: 
  - irrelevant

Total commits in the last 4 weeks: 13
Contributions by author:

    Rich Trott (rtrott@gmail.com):
      Commits: 6
      Files changed: 16
      Insertions: 84
      Deletions: 15

    Luigi Pinca (luigipinca@gmail.com):
      Commits: 1
      Files changed: 2
      Insertions: 24
      Deletions: 20

    James M Snell (jasnell@gmail.com):
      Commits: 1
      Files changed: 2
      Insertions: 23
      Deletions: 1

    Arnold Zokas (arnold.zokas@coderoom.net):
      Commits: 1
      Files changed: 1
      Insertions: 12
      Deletions: 0

    Rod Vagg (rod@vagg.org):
      Commits: 1
      Files changed: 1
      Insertions: 11
      Deletions: 0

    Antoine du Hamel (duhamelantoine1995@gmail.com):
      Commits: 1
      Files changed: 1
      Insertions: 2
      Deletions: 2

    Stephen Gallagher (sgallagh@redhat.com):
      Commits: 1
      Files changed: 1
      Insertions: 1
      Deletions: 1

    Rafael Gonzaga (rafael.nunu@hotmail.com):
      Commits: 1
      Files changed: 1
      Insertions: 1
      Deletions: 0
`
