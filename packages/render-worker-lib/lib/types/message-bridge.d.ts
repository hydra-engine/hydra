import { EventEmitter } from '@webtaku/event-emitter';
export declare class MessageBridge extends EventEmitter<{
    animationChanged: (id: number, animation: number) => void;
}> {
    #private;
    constructor(port: MessagePort);
    getText(id: number): string;
}
//# sourceMappingURL=message-bridge.d.ts.map