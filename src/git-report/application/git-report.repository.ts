import {GitReport} from '../domain/git-report'

export interface ReadGitReportParams {
  projectPath: string
  weeks: number
  updateBeforeRead: boolean
}

export interface GitReportRepository {
  readGitReport (params: ReadGitReportParams): Promise<GitReport>
  readGitProjects (directoryPath: string): Promise<string[]>
}
