import {GitReportList} from '../domain/git-report-list'

export interface GitReportRepository {
  readGitReports (projectsPaths: string[], weeks: number): Promise<GitReportList>
  readGitProjects (directoryPath: string): Promise<string[]>
}
