import { EventEmitter } from '@webtaku/event-emitter';
export class MessageBridge extends EventEmitter {
    #texts = new Map();
    constructor(port) {
        super();
        port.onmessage = (event) => {
            const type = event.data.type;
            if (type === 'text') {
                this.#texts.set(event.data.id, event.data.text);
            }
            else if (type === 'animationChanged') {
                this.emit('animationChanged', event.data.id, event.data.animation);
            }
        };
    }
    getText(id) {
        return this.#texts.get(id) ?? '';
    }
}
//# sourceMappingURL=message-bridge.js.map