import { injectable } from 'tsyringe'
import { request } from 'undici'
import { RequestOptions } from 'undici/types/client'

@injectable()
export class Notifier {
  async publishOnSlack (slackUrl: string, message: string): Promise<void> {
    try {
      await request(slackUrl, {
        method: 'POST',
        body: JSON.stringify({ text: message }, null, 2)
      } as RequestOptions)
    } catch (err) {
      console.error('Error publishing on Slack')
      console.error(err.toString())
    }
  }
}
