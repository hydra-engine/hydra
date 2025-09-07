export declare class Preloader {
    #private;
    constructor(assetIds: number[], progressCallback?: (progress: number) => void);
    preload(): Promise<void>;
    markLoaded(id: number): void;
}
//# sourceMappingURL=preloader.d.ts.map