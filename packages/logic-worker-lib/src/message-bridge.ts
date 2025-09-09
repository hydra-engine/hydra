export class MessageBridge {
  #port: MessagePort

  constructor(port: MessagePort) {
    this.#port = port
  }

  sendTextToRenderWorker(id: number, text: string) {
    this.#port.postMessage({ type: 'text', id, text })
  }
}
