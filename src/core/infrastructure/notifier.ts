import { inject, injectable } from 'tsyringe'
import { request } from 'undici'
import { RequestOptions } from 'undici/types/client'
import { Logger } from './logger'
import { handleError } from '@core/domain/error'

@injectable()
export class Notifier {
  constructor (@inject(Logger) private logger: Logger) {}

  async publishOnSlack (slackUrl: string, message: string): Promise<void> {
    try {
      await request(slackUrl, {
        method: 'POST',
        body: JSON.stringify({ text: message }, null, 2)
      } as RequestOptions)
    } catch (err) {
      this.logger.error('Error publishing on Slack')
      handleError(err, this.logger.error)
    }
  }
}
