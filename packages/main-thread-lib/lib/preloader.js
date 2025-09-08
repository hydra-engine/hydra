import { audioLoader } from './loaders/audio';
import { fontFamilyLoader } from './loaders/font';
const EXTERNAL_LOADER = Symbol('EXTERNAL_LOADER');
const loaderForPathMap = [
    { check: (p) => p.endsWith('.json') || p.endsWith('.atlas'), loader: EXTERNAL_LOADER },
    { check: (p) => p.endsWith('.skel'), loader: EXTERNAL_LOADER },
    { check: (p) => /\.(png|jpe?g|gif|webp)$/i.test(p), loader: EXTERNAL_LOADER },
    { check: (p) => /\.(mp3|wav|ogg)$/i.test(p), loader: audioLoader },
    { check: (p) => !p.includes('.'), loader: fontFamilyLoader },
];
function getLoaderForPath(path) {
    return loaderForPathMap.find(({ check }) => check(path))?.loader;
}
const idToLoaderMap = new Map();
async function loadAsset(id, asset) {
    if (typeof asset !== 'string') {
        console.warn(`Unknown asset type: ${asset}`);
        return;
    }
    const loader = getLoaderForPath(asset);
    if (!loader) {
        console.warn(`No loader found for asset: ${asset}`);
        return;
    }
    idToLoaderMap.set(id, loader);
    if (loader !== EXTERNAL_LOADER) {
        await loader.load(id, asset);
    }
}
function releaseAsset(id) {
    const loader = idToLoaderMap.get(id);
    if (!loader)
        return;
    if (loader !== EXTERNAL_LOADER) {
        ;
        loader.release(id);
    }
}
export class Preloader {
    #assetSources;
    #assetIds;
    // 내부 로드 대상
    #internalLoadIds;
    // 진행률/완료 판단용 전체 대기 집합(내부+외부)
    #waitIds;
    #progressCallback;
    #loadedSet = new Set();
    #resolvePreload;
    #preloadPromise;
    constructor(assetSources, assetIds, progressCallback) {
        this.#assetSources = assetSources;
        this.#assetIds = assetIds;
        this.#progressCallback = progressCallback;
        // 전체 대기 집합: 로더가 식별되는 모든 항목
        this.#waitIds = this.#assetIds.filter((id) => {
            const src = this.#assetSources[id];
            return typeof src === 'string' && !!getLoaderForPath(src);
        });
        // 내부 로드 집합: 내부 로더가 있는 항목만
        this.#internalLoadIds = this.#waitIds.filter((id) => {
            const src = this.#assetSources[id];
            const loader = getLoaderForPath(src);
            return loader && loader !== EXTERNAL_LOADER;
        });
        this.#preloadPromise = new Promise((resolve) => {
            this.#resolvePreload = resolve;
        });
    }
    /** 자동 로드 수행(내부 로더 대상만). 외부 대상은 notifyLoaded(id)를 기다림. */
    async preload() {
        // 기다릴 게 없으면 즉시 완료
        if (this.#waitIds.length === 0 || this.#loadedSet.size >= this.#waitIds.length) {
            this.#resolvePreload?.();
            return this.#preloadPromise;
        }
        await Promise.all(this.#internalLoadIds.map(async (id) => {
            const asset = this.#assetSources[id];
            if (asset === undefined) {
                console.warn(`[Preloader] Missing asset for id=${id}`);
                this.notifyLoaded(id); // 누락도 완료로 처리해 카운트 일관성 유지
                return;
            }
            try {
                await loadAsset(id, asset);
            }
            catch (e) {
                console.warn(`[Preloader] Failed to load asset (id=${id}):`, e);
            }
            finally {
                this.notifyLoaded(id);
            }
        }));
        return this.#preloadPromise;
    }
    /**
     * 외부/내부 공통 완료 신호 함수.
     * 외부 로딩이 끝났을 때도 이 함수를 호출하세요.
     */
    notifyLoaded(id) {
        if (!this.#waitIds.includes(id))
            return;
        if (this.#loadedSet.has(id))
            return;
        this.#loadedSet.add(id);
        const total = this.#waitIds.length;
        const progress = total === 0 ? 1 : this.#loadedSet.size / total;
        this.#progressCallback?.(progress);
        if (this.#loadedSet.size === total) {
            this.#resolvePreload?.();
        }
    }
    /** 자동 로드했던 자원만 해제(외부 주입 리소스는 외부에서 관리) */
    release() {
        for (const id of this.#internalLoadIds) {
            try {
                releaseAsset(id);
            }
            catch (e) {
                console.warn(`[Preloader] Failed to release asset (id=${id}):`, e);
            }
        }
    }
}
//# sourceMappingURL=preloader.js.map