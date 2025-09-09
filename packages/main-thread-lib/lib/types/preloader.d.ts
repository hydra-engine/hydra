import { AssetSource } from '@hydraengine/shared';
export declare class Preloader {
    #private;
    constructor(assetSources: Record<number, AssetSource>, assetIds: number[], progressCallback?: (progress: number) => void);
    preload(): Promise<void>;
    markLoaded(id: number): void;
}
//# sourceMappingURL=preloader.d.ts.map