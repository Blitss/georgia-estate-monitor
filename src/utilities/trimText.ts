/**
 * Trim whitespace except single leading/trailing non-breaking space
 */
export function trimText(text: string): string {
  return text
    .trim()
    .replace(/ +(?= )/g, '')
    .replace(/\r?\n|\r/g, '')
}
