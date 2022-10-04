export const escapeMarkdown = str => {
  const escapeChars = '_*`['

  return str.replaceAll(new RegExp(`([${escapeChars}])`, 'g'), '\\$1')
}

export const escapeTag = str => {
  return str.replace(/[^a-z0-9]/gi, '')
}
