import util from 'util'
import { exec as execCallback } from 'child_process'

const exec = util.promisify(execCallback)

describe('Logger should', () => {
  beforeAll(async () => {
    await exec('npm run build:only')
  }, 30_000)

  it('output logs', async () => {
    const { stdout } = await exec(`node -e "(${testLog.toString()})()"`)

    expect(stdout).toContain('info')
    expect(stdout).not.toContain('error')
  })
  it('output error', async () => {
    const { stderr } = await exec(`node -e "(${testLog.toString()})()"`)

    expect(stderr).toContain('error')
    expect(stderr).not.toContain('info')
  })
})

function testLog () {
  require('reflect-metadata')
  const { Logger } = require('./build/logger')

  const log = new Logger()

  log.error('error')
  log.info('info')
}
