export class MessageBridge {
  #port: MessagePort

  constructor(port: MessagePort) {
    this.#port = port
  }

  sendTextToRenderWorker(id: number, text: string) {
    this.#port.postMessage({ type: 'text', id, text })
  }

  sendAnimationChangedToRenderWorker(id: number, animation: number) {
    this.#port.postMessage({ type: 'animationChanged', id, animation })
  }
}
