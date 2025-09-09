export class MessageBridge {
    constructor(port) {
        port.onmessage = (event) => {
            console.log(event);
        };
    }
}
//# sourceMappingURL=message-bridge.js.map