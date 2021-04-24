import { inject, injectable } from 'tsyringe'
import { Command } from '../command'
import path from 'path'

@injectable()
export class GitReporterRepository {
  constructor (@inject(Command) private readonly command: Command) {}

  readGitLog (projectPath: string, period: string): Promise<string> {
    const absolutePath = path.resolve(projectPath)
    return this.command.run(
      `git -C ${absolutePath} fetch && git -C ${absolutePath} pull && git -C ${absolutePath} log --after="${period}" --all`
    )
  }
}
