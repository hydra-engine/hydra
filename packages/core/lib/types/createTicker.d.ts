export type CreateTickerParameters = {
    fixedFps?: number | undefined;
    onTick: (deltaTime: number) => void;
};
export type Ticker = {
    setFixedFps: (fps: number | undefined) => void;
    destroy: () => void;
};
export declare function createTicker(parameters: CreateTickerParameters): Ticker;
//# sourceMappingURL=createTicker.d.ts.map