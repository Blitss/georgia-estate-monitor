export interface Listener {
  id?: string
  chatId: number
  message: string
  observedUrl: string
  sentIds: string[]
}

export class ListenersStore {
  constructor(private readonly kv: KVNamespace) {}

  async getAll(): Promise<Listener[]> {
    try {
      return JSON.parse(await this.kv.get('listeners')) || []
    } catch (e) {
      return []
    }
  }

  async addListener(listener: Listener) {
    const all = await this.getAll()

    await this.kv.put('listeners', JSON.stringify([...all, listener]))
  }

  async removeAll() {
    await this.kv.delete('listeners')
  }

  async removeListener(idToDelete: string) {
    const all = await this.getAll()

    await this.kv.put('listeners', JSON.stringify(all.filter(({ id }) => id !== idToDelete)))
  }

  async appendSentIds(listenerId: string, ids: string[]) {
    const all = await this.getAll()

    const modified = all.map(listener => {
      if (listener.id === listenerId) {
        return {
          ...listener,
          sentIds: [...listener.sentIds, ...ids],
        }
      }

      return listener
    })

    await this.kv.put('listeners', JSON.stringify(modified))

    return modified
  }
}
