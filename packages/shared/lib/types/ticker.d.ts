export declare class Ticker {
    #private;
    constructor(onTick: (deltaTime: number) => void, fps?: number);
    setFpsCap(fps: number): void;
    disableFpsCap(): void;
    remove(): void;
}
//# sourceMappingURL=ticker.d.ts.map