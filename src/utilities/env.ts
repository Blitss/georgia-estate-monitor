// Because Cloudflare Worker expose env variables in the global context, we have to
// use a helper to make it easier for the testing in the Node.JS environment
export function getEnvVariable(name: string) {
  return (global as any)[name] || process.env[name]
}
