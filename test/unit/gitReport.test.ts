import { GitReport } from '../../src/gitReport/domain/gitReport'
import { buildCommitterInfo } from '../builders'

describe('Git Report should', () => {
  it('retrieve total commits between all committers', async () => {
    const report = new GitReport({
      weeks: 4,
      projects: [],
      committers: [
        buildCommitterInfo({ totalCommits: 1 }),
        buildCommitterInfo({ totalCommits: 1 })
      ]
    })

    expect(report.totalCommits).toBe(2)
  })

  it('retrieve total insertions between all committers', async () => {
    const report = new GitReport({
      weeks: 4,
      projects: [],
      committers: [
        buildCommitterInfo({ totalInsertions: 2 }),
        buildCommitterInfo({ totalInsertions: 2 })
      ]
    })

    expect(report.totalInsertions).toBe(4)
  })

  it('retrieve total deletions between all committers', async () => {
    const report = new GitReport({
      weeks: 4,
      projects: [],
      committers: [
        buildCommitterInfo({ totalDeletions: 2 }),
        buildCommitterInfo({ totalDeletions: 2 })
      ]
    })

    expect(report.totalDeletions).toBe(4)
  })

  it('retrieve total files changed between all committers', async () => {
    const report = new GitReport({
      weeks: 4,
      projects: [],
      committers: [
        buildCommitterInfo({ totalFilesChanged: 2 }),
        buildCommitterInfo({ totalFilesChanged: 2 })
      ]
    })

    expect(report.totalFilesChanged).toBe(4)
  })

  it('retrieve total commits, files changed, insertions and deletions for each committer', async () => {
    const committers = [buildCommitterInfo(), buildCommitterInfo(), buildCommitterInfo()]

    const report = new GitReport({
      weeks: 4,
      projects: [],
      committers
    })

    expect(report.committers).toEqual(committers)
  })

  it('retrieve the amount of weeks used for generating the report', async () => {
    const report = new GitReport({
      weeks: 4,
      projects: [],
      committers: []
    })

    expect(report.weeks).toBe(4)
  })

  it('retrieve the projects used for generating the report', async () => {
    const projects = ['node', 'loopback', 'underscore']

    const report = new GitReport({
      weeks: 4,
      projects,
      committers: []
    })

    expect(report.projects).toEqual(projects)
  })

  it('anonymize committers personal data', () => {
    const committers = [
      buildCommitterInfo({ name: 'Robin', email: 'robin@batman.cave', totalCommits: 2 }),
      buildCommitterInfo({ name: 'Batman', email: 'im@batman.cave', totalCommits: 1 })
    ]

    const report = new GitReport({
      weeks: 4,
      projects: [],
      committers
    }).anonymize()

    expect(report.totalCommits).toBe(3)
    expect(report.committers[0].totalCommits).toBe(committers[0].totalCommits)
    expect(report.committers[0].email).not.toBe(committers[0].email)
    expect(report.committers[0].name).not.toBe(committers[0].name)
    expect(report.committers[1].totalCommits).toBe(committers[1].totalCommits)
    expect(report.committers[1].email).not.toBe(committers[1].email)
    expect(report.committers[1].name).not.toBe(committers[1].name)
  })

  it.todo('sort committers by total commits, insertions, deletions and files changed')
})
