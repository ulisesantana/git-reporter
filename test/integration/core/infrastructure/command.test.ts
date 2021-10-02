import {container} from 'tsyringe'
import {Shell} from '../../../../src/core/infrastructure/shell'

describe('Command should', () => {
  it('run an unix command and show its output', async () => {
    const result = await container.resolve(Shell).run('ls ./test/integration/core/infrastructure')
    expect(result).toContain('command.test.ts')
  })
})
