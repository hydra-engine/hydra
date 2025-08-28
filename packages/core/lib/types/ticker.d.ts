export declare class Ticker {
    #private;
    constructor(onTick: (deltaTime: number) => void, fixedFps?: number);
    setFixedFps(fps: number): void;
    disableFixedFps(): void;
    destroy(): void;
}
//# sourceMappingURL=ticker.d.ts.map