import './global-declarations'

import { handleListingUpdates } from './handleListingUpdates'
import { bindTelegramListeners } from './telegram/listener-manager'
import { bot, cfApp } from './telegram/telegraf'

function start() {
  return bindTelegramListeners(bot)
}

start()
cfApp.listen()

addEventListener('scheduled', (event: any) => {
  console.log('Running scheduled event')
  event.waitUntil(handleListingUpdates())
})
