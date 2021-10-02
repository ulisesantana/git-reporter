import {injectable} from 'tsyringe'

@injectable()
export class Logger {
  info(...text: string[]): void {
    console.info(...text)
  }

  error(...text: string[]): void {
    console.error(...text)
  }
}
