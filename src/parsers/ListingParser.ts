import { Listing } from '../Listing'

export abstract class ListingParser {
  abstract canMatch(url: string): boolean
  abstract parseByUrl(url: string): Promise<Listing[]>
}
