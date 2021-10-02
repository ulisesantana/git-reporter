import {GitReport} from '../domain/git-report'

export interface GitReportRepository {
  readGitReport (projectsPath: string, weeks: number): Promise<GitReport>
  readGitProjects (directoryPath: string): Promise<string[]>
}
