import {GitReport} from '../../src/git-report/domain/git-report'

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

export const expectedReportCompactOutput = `Report for:
  - irrelevant

Total commits in the last 4 weeks: [36m13[39m
Contributions by author:

    👥 [35mRich Trott[39m: [36m6[39m commits and [33m16[39m files changed.
    👥 [35mLuigi Pinca[39m: [36m1[39m commits and [33m2[39m files changed.
    👥 [35mJames M Snell[39m: [36m1[39m commits and [33m2[39m files changed.
    👥 [35mArnold Zokas[39m: [36m1[39m commits and [33m1[39m files changed.
    👥 [35mRod Vagg[39m: [36m1[39m commits and [33m1[39m files changed.
    👥 [35mAntoine du Hamel[39m: [36m1[39m commits and [33m1[39m files changed.
    👥 [35mStephen Gallagher[39m: [36m1[39m commits and [33m1[39m files changed.
    👥 [35mRafael Gonzaga[39m: [36m1[39m commits and [33m1[39m files changed.

⚠️  Report generated without updating git projects. For generating a report updating projects use --forceUpdate (-f) option.`

export const expectedUpdatedReportCompactOutput = `Report for:
  - irrelevant

Total commits in the last 4 weeks: [36m13[39m
Contributions by author:

    👥 [35mRich Trott[39m: [36m6[39m commits and [33m16[39m files changed.
    👥 [35mLuigi Pinca[39m: [36m1[39m commits and [33m2[39m files changed.
    👥 [35mJames M Snell[39m: [36m1[39m commits and [33m2[39m files changed.
    👥 [35mArnold Zokas[39m: [36m1[39m commits and [33m1[39m files changed.
    👥 [35mRod Vagg[39m: [36m1[39m commits and [33m1[39m files changed.
    👥 [35mAntoine du Hamel[39m: [36m1[39m commits and [33m1[39m files changed.
    👥 [35mStephen Gallagher[39m: [36m1[39m commits and [33m1[39m files changed.
    👥 [35mRafael Gonzaga[39m: [36m1[39m commits and [33m1[39m files changed.`

export const expectedReportVerboseOutput = `Report for:
  - irrelevant

Total commits in the last 4 weeks: [36m13[39m
Contributions by author:

    👥 [35mRich Trott[39m ([90mrtrott@gmail.com[39m):
      ✨ Commits: [36m6[39m
      📝 Files changed: [33m16[39m
      ➕ Insertions: [32m84[39m
      ➖ Deletions: [31m15[39m

    👥 [35mLuigi Pinca[39m ([90mluigipinca@gmail.com[39m):
      ✨ Commits: [36m1[39m
      📝 Files changed: [33m2[39m
      ➕ Insertions: [32m24[39m
      ➖ Deletions: [31m20[39m

    👥 [35mJames M Snell[39m ([90mjasnell@gmail.com[39m):
      ✨ Commits: [36m1[39m
      📝 Files changed: [33m2[39m
      ➕ Insertions: [32m23[39m
      ➖ Deletions: [31m1[39m

    👥 [35mArnold Zokas[39m ([90marnold.zokas@coderoom.net[39m):
      ✨ Commits: [36m1[39m
      📝 Files changed: [33m1[39m
      ➕ Insertions: [32m12[39m
      ➖ Deletions: [31m0[39m

    👥 [35mRod Vagg[39m ([90mrod@vagg.org[39m):
      ✨ Commits: [36m1[39m
      📝 Files changed: [33m1[39m
      ➕ Insertions: [32m11[39m
      ➖ Deletions: [31m0[39m

    👥 [35mAntoine du Hamel[39m ([90mduhamelantoine1995@gmail.com[39m):
      ✨ Commits: [36m1[39m
      📝 Files changed: [33m1[39m
      ➕ Insertions: [32m2[39m
      ➖ Deletions: [31m2[39m

    👥 [35mStephen Gallagher[39m ([90msgallagh@redhat.com[39m):
      ✨ Commits: [36m1[39m
      📝 Files changed: [33m1[39m
      ➕ Insertions: [32m1[39m
      ➖ Deletions: [31m1[39m

    👥 [35mRafael Gonzaga[39m ([90mrafael.nunu@hotmail.com[39m):
      ✨ Commits: [36m1[39m
      📝 Files changed: [33m1[39m
      ➕ Insertions: [32m1[39m
      ➖ Deletions: [31m0[39m


⚠️  Report generated without updating git projects. For generating a report updating projects use --forceUpdate (-f) option.`
