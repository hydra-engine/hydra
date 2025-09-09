export class MessageBridge {
  constructor(port: MessagePort) {
    port.onmessage = (event) => {
      console.log(event)
    }
  }
}
