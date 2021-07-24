import { AccumulatedGitReport } from '../src/gitReport/domain/gitReport'

export const expectedReport: AccumulatedGitReport = {
  weeks: 4,
  projects: ['irrelevant'],
  totalCommits: 13,
  committers: [
    {
      email: 'rtrott@gmail.com',
      name: 'Rich Trott',
      totalCommits: 6,
      totalFilesChanged: 16,
      totalInsertions: 84,
      totalDeletions: 15
    },
    {
      email: 'duhamelantoine1995@gmail.com',
      name: 'Antoine du Hamel',
      totalCommits: 1,
      totalFilesChanged: 1,
      totalInsertions: 2,
      totalDeletions: 2
    },
    {
      email: 'arnold.zokas@coderoom.net',
      name: 'Arnold Zokas',
      totalCommits: 1,
      totalFilesChanged: 1,
      totalInsertions: 12,
      totalDeletions: 0
    },
    {
      email: 'jasnell@gmail.com',
      name: 'James M Snell',
      totalCommits: 1,
      totalFilesChanged: 2,
      totalInsertions: 23,
      totalDeletions: 1
    },
    {
      email: 'luigipinca@gmail.com',
      name: 'Luigi Pinca',
      totalCommits: 1,
      totalFilesChanged: 2,
      totalInsertions: 24,
      totalDeletions: 20
    },
    {
      email: 'rafael.nunu@hotmail.com',
      name: 'Rafael Gonzaga',
      totalCommits: 1,
      totalFilesChanged: 1,
      totalInsertions: 1,
      totalDeletions: 0
    },
    {
      email: 'rod@vagg.org',
      name: 'Rod Vagg',
      totalCommits: 1,
      totalFilesChanged: 1,
      totalInsertions: 11,
      totalDeletions: 0
    },
    {
      email: 'sgallagh@redhat.com',
      name: 'Stephen Gallagher',
      totalCommits: 1,
      totalFilesChanged: 1,
      totalInsertions: 1,
      totalDeletions: 1
    }
  ]
}

export const expectedReportForMultipleRepositories = {
  ...expectedReport,
  projects: ['irrelevant', 'irrelevant'],
  totalCommits: expectedReport.totalCommits * 2,
  committers: expectedReport.committers.map(committer => ({
    email: committer.email,
    name: committer.name,
    totalCommits: committer.totalCommits * 2,
    totalFilesChanged: committer.totalFilesChanged * 2,
    totalInsertions: committer.totalInsertions * 2,
    totalDeletions: committer.totalDeletions * 2
  }))
}

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

    Antoine du Hamel (duhamelantoine1995@gmail.com):
      Commits: 1
      Files changed: 1
      Insertions: 2
      Deletions: 2

    Arnold Zokas (arnold.zokas@coderoom.net):
      Commits: 1
      Files changed: 1
      Insertions: 12
      Deletions: 0

    James M Snell (jasnell@gmail.com):
      Commits: 1
      Files changed: 2
      Insertions: 23
      Deletions: 1

    Luigi Pinca (luigipinca@gmail.com):
      Commits: 1
      Files changed: 2
      Insertions: 24
      Deletions: 20

    Rafael Gonzaga (rafael.nunu@hotmail.com):
      Commits: 1
      Files changed: 1
      Insertions: 1
      Deletions: 0

    Rod Vagg (rod@vagg.org):
      Commits: 1
      Files changed: 1
      Insertions: 11
      Deletions: 0

    Stephen Gallagher (sgallagh@redhat.com):
      Commits: 1
      Files changed: 1
      Insertions: 1
      Deletions: 1
`

export const rawGitLog = `Arnold Zokas | arnold.zokas@coderoom.net
 1 file changed, 12 insertions(+)

Luigi Pinca | luigipinca@gmail.com
 2 files changed, 24 insertions(+), 20 deletions(-)

Rich Trott | rtrott@gmail.com
 1 file changed, 1 insertion(+), 1 deletion(-)

Rich Trott | rtrott@gmail.com
 1 file changed, 1 insertion(+), 1 deletion(-)

Rich Trott | rtrott@gmail.com
 2 files changed, 3 insertions(+), 3 deletions(-)

Rafael Gonzaga | rafael.nunu@hotmail.com
 1 file changed, 1 insertion(+)

James M Snell | jasnell@gmail.com
 2 files changed, 23 insertions(+), 1 deletion(-)

Rich Trott | rtrott@gmail.com
 1 file changed, 0 insertions(+), 0 deletions(-)

Antoine du Hamel | duhamelantoine1995@gmail.com
 1 file changed, 2 insertions(+), 2 deletions(-)

Stephen Gallagher | sgallagh@redhat.com
 1 file changed, 1 insertion(+), 1 deletion(-)

Rod Vagg | rod@vagg.org
 1 file changed, 11 insertions(+)

Rich Trott | rtrott@gmail.com
 5 files changed, 38 insertions(+), 5 deletions(-)

Rich Trott | rtrott@gmail.com
 6 files changed, 41 insertions(+), 5 deletions(-)
`
