export class Logger {
  info (...text: any[]) {
    console.log(...text)
  }

  error (...text: any[]) {
    console.error(...text)
  }
}
