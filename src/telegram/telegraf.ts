import createTelegrafMiddleware from 'cfworker-middleware-telegraf'
import { Application, Router } from '@cfworker/web'
import { Telegraf } from 'telegraf'

import { SendoutBot } from './SendoutBot'
import { getEnvVariable } from '../utilities/env'

export const bot = new Telegraf(getEnvVariable('BOT_TOKEN'))

const router = new Router()
router.get('/set-webhook', async ctx => {
  const address = getEnvVariable('WEBHOOK_URL')
  const result = await bot.telegram.setWebhook(address)

  ctx.respondWith(
    new Response(
      JSON.stringify({
        address,
        result,
      })
    )
  )
})
router.get('/test', async ctx => {
  const sendout = new SendoutBot()

  await sendout.sendMessageWithPictures(
    `- 1 room Flat for rent. Saburtalo
- vaja-pshavela avenue
- 50 m²
- ბროკერებთან არ ვთანამშრომლობ! ქირავდება ახალი გარემონტებული 2 ოთახიანი ბინა, ყველაფრით უზრუნველყოფილი, ბინა მდებარეობს თბილისის ცენტრალურ უბანში ვაჟა ფშაველას 8 ნომერში.
- 986 $/ 2820 GEL
- https://ss.ge/en/real-estate/1-room-flat-for-rent-saburtalo-5638317
- #Tbilisi, #Vake-Saburtalo, #Saburtalo, #vaja-pshavelaavenue
- +995599964000`,
    213043401,
    [
      'https://static.ss.ge/20221004/1_5e765690-b27e-4e20-acba-79c0c2c0e6f9.jpg',
      'https://static.ss.ge/20221004/1_5346e8ea-383b-4eaa-a700-67330cbd869d.jpg',
    ]
  )

  ctx.respondWith(new Response('ok.'))
})

router.post(getEnvVariable('SECRET_PATH') || '/telegram-webhook', createTelegrafMiddleware(bot))
export const cfApp = new Application().use(router.middleware)
