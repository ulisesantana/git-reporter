import { Writable } from 'stream'
import { format } from 'util'
import { EOL } from 'os'

export class Logger extends Writable {
  private content: Buffer[] = []
  constructor () {
    super({
      write: (chunk, _encoding, callback) => {
        this.content.push(chunk)
        callback()
      }
    })
  }

  info (...text: string[]): void {
    process.stdout.write(this.formatOutput(...text))
  }

  error (...text: string[]): void {
    process.stderr.write(this.formatOutput(...text))
  }

  getContents (): string {
    return String(Buffer.concat(this.content))
  }

  private formatOutput (...text: string[]) {
    const output = format('%s', ...text, EOL)
    this.write(`${output}${EOL}`)
    return output
  }
}
