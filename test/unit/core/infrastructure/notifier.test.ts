import { container } from 'tsyringe'
import { request } from 'undici'
import { Logger } from '@core/infrastructure/logger'
import { Notifier } from '@core/infrastructure/notifier'

jest.mock('undici', () => ({
  ...(jest.requireActual<any>('undici')),
  request: jest.fn(async (slackUrl) => {
    if (slackUrl === '') {
      throw new Error('Boom!!')
    }
  })
}))

describe('Notifier should', () => {
  const logger: Logger = new Logger()
  logger.error = jest.fn()
  container.registerInstance(Logger, logger)
  const notifier = new Notifier(logger)
  const slackUrl = 'irrelevantUrl'
  const message = 'irrelevantMessage'

  it('notify on slack through HTTP request', async () => {
    await notifier.publishOnSlack(slackUrl, message)

    expect(request).toHaveBeenCalledWith(slackUrl, {
      method: 'POST',
      body: JSON.stringify({ text: message }, null, 2)
    })
    expect(logger.error).not.toHaveBeenCalledWith('Boom!!')
  })

  it('log the error if there is any during the HTTP request', async () => {
    await notifier.publishOnSlack('', message)
    expect(logger.error).toHaveBeenCalledWith('Error publishing on Slack')
    expect(logger.error).toHaveBeenCalledWith('Error: Boom!!')
  })
})
