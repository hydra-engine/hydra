import { AssetSource } from '@hydraengine/shared';
export declare class Preloader {
    #private;
    constructor(assetSources: Record<number, AssetSource>, assetIds: number[], progressCallback?: (progress: number) => void);
    /** loadAsset을 사용해 실제 프리로드 수행 */
    preload(): Promise<void>;
    /** 진행률 업데이트 (내부 로더 대상만 카운트) */
    markLoaded(id: number): void;
    /** 프리로드된(내부 로더 대상) 리소스 해제 */
    release(): void;
}
//# sourceMappingURL=preloader.d.ts.map