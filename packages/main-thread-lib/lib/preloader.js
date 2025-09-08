import { audioLoader } from './loaders/audio';
import { fontFamilyLoader } from './loaders/font';
const EXTERNAL_LOADER = Symbol('EXTERNAL_LOADER');
const loaderForPathMap = [
    { check: (p) => p.endsWith('.json') || p.endsWith('.atlas'), loader: EXTERNAL_LOADER }, // 외부 주입
    { check: (p) => p.endsWith('.skel'), loader: EXTERNAL_LOADER }, // 외부 주입
    { check: (p) => /\.(png|jpe?g|gif|webp)$/i.test(p), loader: EXTERNAL_LOADER }, // 외부 주입
    { check: (p) => /\.(mp3|wav|ogg)$/i.test(p), loader: audioLoader },
    { check: (p) => !p.includes('.'), loader: fontFamilyLoader }
];
function getLoaderForPath(path) {
    return loaderForPathMap.find(({ check }) => check(path))?.loader;
}
const idToLoaderMap = new Map();
async function loadAsset(id, asset) {
    if (typeof asset === 'string') {
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
    else {
        console.warn(`Unknown asset type: ${asset}`);
    }
}
function releaseAsset(id) {
    const loader = idToLoaderMap.get(id);
    if (!loader) {
        console.warn(`No loader found for asset ID: ${id}`);
        return;
    }
    if (loader !== EXTERNAL_LOADER) {
        loader.release(id);
    }
}
export class Preloader {
    #assetSources;
    #assetIds;
    #targets; // 내부 로더가 있는 id만
    #progressCallback;
    #loadedCount = 0;
    #loadedSet = new Set();
    #resolvePreload;
    #preloadPromise;
    constructor(assetSources, assetIds, progressCallback) {
        this.#assetSources = assetSources;
        this.#assetIds = assetIds;
        this.#progressCallback = progressCallback;
        // 프리로드 대상: EXTERNAL_LOADER(외부 주입) 제외
        this.#targets = this.#assetIds.filter((id) => {
            const src = this.#assetSources[id];
            if (typeof src !== 'string')
                return false;
            const loader = getLoaderForPath(src);
            return !!loader && loader !== EXTERNAL_LOADER;
        });
        this.#preloadPromise = new Promise((resolve) => {
            this.#resolvePreload = resolve;
        });
    }
    /** loadAsset을 사용해 실제 프리로드 수행 */
    async preload() {
        // 대상이 없거나 이미 완료된 경우 즉시 resolve
        if (this.#targets.length === 0 || this.#loadedCount >= this.#targets.length) {
            this.#resolvePreload?.();
            return this.#preloadPromise;
        }
        await Promise.all(this.#targets.map(async (id) => {
            const asset = this.#assetSources[id];
            if (asset === undefined) {
                console.warn(`[Preloader] Missing asset for id=${id}`);
                // 진행률 계산의 일관성을 위해 missing도 mark
                this.markLoaded(id);
                return;
            }
            try {
                await loadAsset(id, asset);
            }
            catch (e) {
                console.warn(`[Preloader] Failed to load asset (id=${id}):`, e);
            }
            finally {
                this.markLoaded(id);
            }
        }));
        return this.#preloadPromise;
    }
    /** 진행률 업데이트 (내부 로더 대상만 카운트) */
    markLoaded(id) {
        if (!this.#targets.includes(id))
            return; // 대상 외 id 무시
        if (this.#loadedSet.has(id))
            return; // 중복 로딩 방지
        this.#loadedSet.add(id);
        this.#loadedCount++;
        const progress = this.#loadedCount / this.#targets.length;
        this.#progressCallback?.(progress);
        if (this.#loadedCount === this.#targets.length) {
            this.#resolvePreload?.();
        }
    }
    /** 프리로드된(내부 로더 대상) 리소스 해제 */
    release() {
        for (const id of this.#targets) {
            if (this.#loadedSet.has(id)) {
                try {
                    releaseAsset(id);
                }
                catch (e) {
                    console.warn(`[Preloader] Failed to release asset (id=${id}):`, e);
                }
            }
        }
    }
}
//# sourceMappingURL=preloader.js.map