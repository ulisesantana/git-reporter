import { promisify } from 'util'
import { exec as execCallback } from 'child_process'
import { injectable } from 'tsyringe'

const exec = promisify(execCallback)

@injectable()
export class Command {
  async run (command: string): Promise<string> {
    const { stdout } = await exec(command)
    return stdout
  }
}
