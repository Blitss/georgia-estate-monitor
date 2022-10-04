import { map } from 'already'
import { parse } from 'node-html-parser'

import { Listing } from '../Listing'
import { ListingParser } from './ListingParser'
import { trimText } from '../utilities'

const parseHtmlByUrl = async url => {
  // const timeoutSignal = new AbortController()
  // const abortTimeout = setTimeout(() => timeoutSignal.abort(), 5000)

  const response = await fetch(url, {
    cf: {
      cacheTtl: 0,
    },
    headers: {
      // Simulate the real browser to avoid detecting the abuse
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
    },
  })

  const html = await response.text()

  const parsed = parse(html)

  return parsed
}

export class SsGeListingParser extends ListingParser {
  canMatch(url: string): boolean {
    return url.includes('https://ss.ge')
  }

  // Extract details of the listings by the specified URL of the search.
  async parseByUrl(url: string, excluded: string[] = []): Promise<Listing[]> {
    const parsed = await parseHtmlByUrl(url)
    const ads = parsed.querySelectorAll('.latest_article_each[data-id]')

    console.log(`found ${ads.length} ads`)

    const mappedAds = await map(ads, { concurrency: 2 }, async ad => {
      const id = ad.getAttribute('data-id')
      const name = trimText(ad.querySelector('.latest_title').structuredText)
      const address = trimText(ad.querySelector('.StreeTaddressList').textContent)
      const areaSize = trimText(ad.querySelector('.latest_flat_km').textContent)
      const description = trimText(ad.querySelector('.DescripTionListB').textContent)
      const price = trimText(ad.querySelector('.latest_price').structuredText)
      const adUrl = `https://ss.ge${ad.querySelector('.latest_desc a').getAttribute('href')}`

      let extraProps = {}
      if (excluded.length > 0 && !excluded.includes(id)) {
        const details = await parseHtmlByUrl(adUrl)

        const tags = details
          .querySelectorAll('.detailed_page_navlist > ul > li')
          .map(tag => tag.textContent)
          .map(trimText)
          .slice(3)
          .map(d => d.replaceAll(' ', ''))
        const phone = `+995${details
          .querySelector('.EAchPHonenumber.AfterClickedShown')
          .textContent.replaceAll(' ', '')}`

        const photosElements = details.querySelectorAll(
          '.details_basic_slider2 .swiper-slide:not(.swiper-slide-duplicate) .OrdinaryContainer > img'
        )
        const photos = photosElements.map(element => element.getAttribute('src'))

        console.log('photos: ', photos)
        extraProps = {
          tags,
          phone,
          photos,
        }
      }

      return {
        id,
        name,
        address,
        areaSize,
        description,
        price,
        url: adUrl,
        ...extraProps,
      }
    })

    return mappedAds
  }
}
