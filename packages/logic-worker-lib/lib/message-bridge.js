export class MessageBridge {
    #port;
    constructor(port) {
        this.#port = port;
    }
    sendTextToRenderWorker(id, text) {
        this.#port.postMessage({ type: 'text', id, text });
    }
    sendAnimationChangedToRenderWorker(id, animation) {
        this.#port.postMessage({ type: 'animationChanged', id, animation });
    }
}
//# sourceMappingURL=message-bridge.js.map