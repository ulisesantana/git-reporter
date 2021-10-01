import { GitReportList } from '../domain/gitReportList'

export interface GitReportRepository {
  readGitReports (projectsPaths: string[], weeks: number): Promise<GitReportList>
  readGitProjects (directoryPath: string): Promise<string[]>
}
