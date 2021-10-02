import {inject, injectable} from 'tsyringe'
import path from 'path'
import {Shell} from '../../core/infrastructure/shell'
import {GitReport} from '../domain/git-report'
import {GitReportRepository} from '../application/git-report.repository'
import {GitReportMapper} from './git-report.mapper'
import {EOL} from 'os'

@injectable()
export class GitReportImplementationRepository implements GitReportRepository {
  constructor(@inject(Shell) private readonly shell: Shell) {}

  async readGitReport(projectPath: string, weeks: number): Promise<GitReport> {
    try {
      const absolutePath = path.resolve(projectPath)
      await this.shell.run(`git -C ${absolutePath} fetch && git -C ${absolutePath} pull`)
      const gitLog = await this.shell.run(`git -C ${absolutePath} log --after="${weeks} weeks ago" --all --pretty=format:'%an | %ae' --shortstat`)
      return GitReportMapper.toDomain(gitLog, weeks, projectPath)
    } catch (error) {
      return GitReportMapper.toDomain(undefined, weeks, projectPath)
    }
  }

  async readGitProjects(directoryPath: string): Promise<string[]> {
    const absolutePath = path.resolve(directoryPath)
    const list = await this.shell.run(`ls -dl ${absolutePath}/*/.git`)
    if (list.includes('no matches found')) {
      return []
    }
    return list.split(EOL).map(line =>
      line.split(' ').slice(-1)[0].replace('/.git', ''),
    ).filter(Boolean)
  }
}
