export function handleError(error: unknown, log: (...text: string[]) => void): void {
  if (error instanceof Error) {
    log(error.toString())
    error.stack && log(error.stack)
  } else {
    log('Unknown error received:', String(error))
  }
}
