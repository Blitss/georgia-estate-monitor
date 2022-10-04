export function parseTelegramCommand(str: string) {
  const [command, ...commandArguments] = str.split(' ')

  if (!command.startsWith('/')) {
    return null
  }

  return { command, commandArguments }
}
