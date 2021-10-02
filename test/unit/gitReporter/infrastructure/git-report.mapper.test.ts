import {GitReportMapper} from '../../../../src/git-report/infrastructure/git-report.mapper'
import {rawGitLog} from '../../../fixtures'

describe('Git report mapper should', () => {
  describe('map to domain', () => {
    it('successfully', () => {
      const gitReport = GitReportMapper.toDomain(rawGitLog, 4, 'irrelevant')

      expect(gitReport.totalDeletions).toBe(39)
      expect(gitReport.totalInsertions).toBe(158)
      expect(gitReport.totalFilesChanged).toBe(25)
    })
  })
})
