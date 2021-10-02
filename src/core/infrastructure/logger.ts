import {injectable} from 'tsyringe'
import {red} from 'colorette'

@injectable()
export class Logger {
  info(...text: string[]): void {
    console.info(...text)
  }

  error(...text: string[]): void {
    console.error(...text.map(red))
  }
}
