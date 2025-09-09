export class MessageBridge {
    #port;
    constructor(port) {
        this.#port = port;
    }
    sendTextToRenderWorker(id, text) {
        this.#port.postMessage({ type: 'text', id, text });
    }
}
//# sourceMappingURL=message-bridge.js.map