import { SsGeListingParser } from './SsGeListingParser'

export const parsers = [new SsGeListingParser()]
export const findMatchingParser = url => parsers.find(parser => parser.canMatch(url))
