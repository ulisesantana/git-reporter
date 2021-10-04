import {GitReport} from '../domain/git-report'

export interface ProgressBar {
  start (total: number, initial: number): void
  increment (value?: number): void
  stop (): void
  value: number
  total: number
}

export interface GitReportPrinter {
  info(...text: string[]): void
  error(...text: string[]): void
  generateProgressBar(conceptToProgressAbout: string): ProgressBar
  printInit(): void
  printStartFetchingDirectory(pathToDirectory: string): void
  printStartFetchingProjects(projectsPath: string[]): void
  printFailedReports(failedReports: GitReport[]): void
}
