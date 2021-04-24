import { inject, injectable } from 'tsyringe'
import { Command } from '../command'
import path from 'path'

@injectable()
export class GitReporterRepository {
  constructor (@inject(Command) private readonly command: Command) {}

  readGitLog (projectPath: string, weeks: number): Promise<string> {
    const absolutePath = path.resolve(projectPath)
    return this.command.run(
      `git -C ${absolutePath} fetch && git -C ${absolutePath} pull && git -C ${absolutePath} log --after="${weeks} weeks ago" --all`
    )
  }

  async readGitProjects (directoryPath: string): Promise<string[]> {
    const absolutePath = path.resolve(directoryPath)
    const list = await this.command.run(`ls -dl ${absolutePath}/*/.git`)
    return list.split('\n').map(line =>
      line.split(' ').slice(-1)[0].replace('/.git', '')
    ).filter(Boolean)
  }
}
