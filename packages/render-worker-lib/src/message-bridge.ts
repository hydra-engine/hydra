export class MessageBridge {
  #texts = new Map<number, string>()

  constructor(port: MessagePort) {
    port.onmessage = (event) => {
      const type = event.data.type

      if (type === 'text') {
        this.#texts.set(event.data.id, event.data.text)
      }
    }
  }

  getText(id: number) {
    return this.#texts.get(id) ?? ''
  }
}
