import util from 'util'
import {exec as execCallback} from 'child_process'
import {Logger} from '../../../../src/core/infrastructure/logger'

const exec = util.promisify(execCallback)

describe('Logger should', () => {
  beforeAll(async () => {
    await exec('npm run build')
  }, 60_000)
  afterAll(() => {
    jest.resetAllMocks()
  })

  it('output logs', async () => {
    const {stdout} = await exec(`node -e "(${testLog.toString()})()"`)

    expect(stdout).toContain('info')
    expect(stdout).not.toContain('error')
  })

  it('output error', async () => {
    const {stderr} = await exec(`node -e "(${testLog.toString()})()"`)

    expect(stderr).toContain('error')
    expect(stderr).not.toContain('info')
  })

  it('use node built in console', () => {
    console.info = jest.fn()
    console.error = jest.fn()
    const logger = new Logger()

    logger.info('info')
    logger.error('error')

    expect(console.info).toHaveBeenCalledWith('info')
    expect(console.error).toHaveBeenCalledWith('error')
  })
})

function testLog() {
  require('reflect-metadata')
  const {Logger} = require('./lib/core/infrastructure/logger')

  const log = new Logger()

  log.error('error')
  log.info('info')
}
