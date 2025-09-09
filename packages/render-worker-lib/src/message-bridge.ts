import { EventEmitter } from '@webtaku/event-emitter'


export class MessageBridge extends EventEmitter<{
  animationChanged: (id: number, animation: number) => void
}> {
  #texts = new Map<number, string>()

  constructor(port: MessagePort) {
    super()
    port.onmessage = (event) => {
      const type = event.data.type

      if (type === 'text') {
        this.#texts.set(event.data.id, event.data.text)
      }

      else if (type === 'animationChanged') {
        this.emit('animationChanged', event.data.id, event.data.animation)
      }
    }
  }

  getText(id: number) {
    return this.#texts.get(id) ?? ''
  }
}
