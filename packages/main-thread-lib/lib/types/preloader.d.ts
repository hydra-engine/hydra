import { AssetSource } from '@hydraengine/shared';
export declare class Preloader {
    #private;
    constructor(assetSources: Record<number, AssetSource>, assetIds: number[], progressCallback?: (progress: number) => void);
    /** 자동 로드 수행(내부 로더 대상만). 외부 대상은 notifyLoaded(id)를 기다림. */
    preload(): Promise<void>;
    /**
     * 외부/내부 공통 완료 신호 함수.
     * 외부 로딩이 끝났을 때도 이 함수를 호출하세요.
     */
    notifyLoaded(id: number): void;
    /** 자동 로드했던 자원만 해제(외부 주입 리소스는 외부에서 관리) */
    release(): void;
}
//# sourceMappingURL=preloader.d.ts.map