import { Listing } from './Listing'
import { SendoutBot } from './telegram/SendoutBot'
import { listenerStore } from './di'
import { findMatchingParser } from './parsers'
import { escapeMarkdown, escapeTag } from './utilities'

const GEL_TO_USD_RATE = 0.35

const formatListing = (listing: Listing) => {
  const priceInGel = Number(listing.price.replaceAll(' ', '').replaceAll('U', ''))

  const omitted = {
    ...listing,
    id: null,
    photos: null,
    description: escapeMarkdown(listing.description),
    price: `${Math.floor(priceInGel * GEL_TO_USD_RATE)} $/ ${priceInGel} GEL`,
    tags: listing.tags.map(tag => `#${escapeTag(tag)}`).join(', '),
    phone: `[${listing.phone}](tel:${listing.phone})`,
  }

  return Object.values(omitted)
    .filter(d => !!d)
    .map(d => `- ${d}`)
    .join('\n')
}

export async function handleListingUpdates() {
  const listeners = await listenerStore.getAll()
  const sendoutBot = new SendoutBot()

  for (const listener of listeners) {
    const matchingParser = findMatchingParser(listener.observedUrl)

    if (matchingParser) {
      const results = await matchingParser.parseByUrl(listener.observedUrl, listener.sentIds)

      if (listener.sentIds.length === 0) {
        console.log('Got the initial results, updating the IDs')

        await listenerStore.appendSentIds(
          listener.id,
          results.map(d => d.id)
        )
      } else {
        console.log('sent ids: ', listener.sentIds)
        const newAds = results.filter(({ id }) => !listener.sentIds.includes(id))

        console.log(
          'Sending the notifications about the new ads',
          newAds.map(d => d)
        )

        const promises = newAds.map(async ad => {
          try {
            await sendoutBot.sendMessageWithPictures(
              `${formatListing(ad)}\n${listener.message}`,
              listener.chatId,
              ad.photos.slice(0, 5)
            )
          } catch (e) {
            console.error(`Failed to send the message: `, e)
          }
        })

        await Promise.all(promises)
        await listenerStore.appendSentIds(
          listener.id,
          newAds.map(d => d.id)
        )
      }
    }
  }
}
