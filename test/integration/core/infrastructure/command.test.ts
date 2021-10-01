import { container } from 'tsyringe'
import { Command } from '../../../../src/core/infrastructure/command'

describe('Command should', () => {
  it('run an unix command and show its output', async () => {
    const result = await container.resolve(Command).run('ls ./test/integration/core/infrastructure')
    expect(result).toContain('command.test.ts')
  })
})
