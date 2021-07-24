import { Logger } from '../../src/logger'

describe('Logger should', () => {
  it('output logs', () => {
    const message = 'irrelevant'
    const logger = new Logger()

    logger.info(message)

    expect(logger.getContents()).toContain(message)
  })
  it('output error', () => {
    const message = 'irrelevant'
    const logger = new Logger()

    logger.error(message)

    expect(logger.getContents()).toContain(message)
  })
})
