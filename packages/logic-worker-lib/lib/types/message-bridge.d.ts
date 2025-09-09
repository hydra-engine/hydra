export declare class MessageBridge {
    #private;
    constructor(port: MessagePort);
    sendTextToRenderWorker(id: number, text: string): void;
    sendAnimationChangedToRenderWorker(id: number, animation: number): void;
}
//# sourceMappingURL=message-bridge.d.ts.map