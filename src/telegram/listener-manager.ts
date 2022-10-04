import { Telegraf } from 'telegraf'

import { listenerStore } from '../di'
import { createId, parseTelegramCommand } from '../utilities'

export function bindTelegramListeners(telegramBot: Telegraf) {
  telegramBot.command('listen', async ctx => {
    try {
      const {
        commandArguments: [observedUrl, ...text],
      } = parseTelegramCommand(ctx.message.text)
      const mergedText = text.join(' ')
      const id = createId()

      await listenerStore.addListener({
        id,
        chatId: ctx.message.chat.id,
        observedUrl,
        message: mergedText,
        sentIds: [],
      })

      await ctx.replyWithMarkdown(`✅ Observing the changes in the URL (${id})`)
    } catch (e) {
      console.error(e)
      await ctx.replyWithMarkdown(`Failed to process the message: ${e.message}`)
    }
  })

  telegramBot.command('remove', async ctx => {
    const {
      commandArguments: [id],
    } = parseTelegramCommand(ctx.message.text)

    await listenerStore.removeListener(id)

    await ctx.replyWithMarkdown(`✅ Removed the listener`)
  })

  telegramBot.command('removeAll', async ctx => {
    await listenerStore.removeAll()

    await ctx.replyWithMarkdown('✅ Removed all')
  })
}
