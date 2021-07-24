import { Command } from '../../src/command'
import { container } from 'tsyringe'

describe('Command should', () => {
  it('run an unix command and show its output', async () => {
    const result = await container.resolve(Command).run('ls ./test/integration')
    expect(result).toContain('command.test.ts')
  })
})
