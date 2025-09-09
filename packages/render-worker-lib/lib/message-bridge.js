export class MessageBridge {
    #texts = new Map();
    constructor(port) {
        port.onmessage = (event) => {
            const type = event.data.type;
            if (type === 'text') {
                this.#texts.set(event.data.id, event.data.text);
            }
        };
    }
    getText(id) {
        return this.#texts.get(id) ?? '';
    }
}
//# sourceMappingURL=message-bridge.js.map