import { getEnvVariable } from '../utilities/env'
import { bot } from './telegraf'

export class SendoutBot {
  get telegramBot() {
    return bot
  }

  async sendMediaGroup(chatId: number, pictures: any[]) {
    const token = getEnvVariable('BOT_TOKEN')

    // Unfortunately workers env don't support node.js streams. so we have to avoid using them
    // Because this is a media call, telegraf converts it to the stream
    const resp = await fetch(`https://api.telegram.org/bot${token}/sendMediaGroup`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', connection: 'keep-alive' },
      body: JSON.stringify({
        chat_id: chatId,
        media: pictures,
      }),
    })

    const json = await resp.json()

    if (resp.status !== 200) {
      throw new Error(JSON.stringify(json))
    }
  }

  async sendMessageWithPictures(message: string, chatId: number, pictures: string[]) {
    if (pictures.length === 0) {
      await this.telegramBot.telegram.sendMessage(chatId, message, { parse_mode: 'Markdown' })
    } else {
      await this.sendMediaGroup(
        chatId,
        pictures.map((pic, index) => ({
          type: 'photo',
          ...(index === 0
            ? {
                caption: message,
                parse_mode: 'Markdown',
              }
            : {}),
          media: pic,
        }))
      )
    }
  }
}
