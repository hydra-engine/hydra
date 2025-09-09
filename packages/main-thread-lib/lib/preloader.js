import { audioLoader } from './loaders/audio';
import { fontFamilyLoader } from './loaders/font';
const EXTERNAL_LOADER = Symbol('EXTERNAL_LOADER');
const loaderForPathMap = [
    { check: (p) => p.endsWith('.json') || p.endsWith('.atlas'), loader: EXTERNAL_LOADER },
    { check: (p) => p.endsWith('.skel'), loader: EXTERNAL_LOADER },
    { check: (p) => /\.(png|jpe?g|gif|webp)$/.test(p), loader: EXTERNAL_LOADER },
    { check: (p) => /\.(mp3|wav|ogg)$/.test(p), loader: audioLoader },
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
    else if ('atlas' in asset) {
        idToLoaderMap.set(id, EXTERNAL_LOADER);
    }
    else if ('fnt' in asset) {
        idToLoaderMap.set(id, EXTERNAL_LOADER);
    }
    else {
        console.warn(`Unknown asset type: ${asset}`);
    }
}
function releaseAsset(id) {
    const loader = idToLoaderMap.get(id);
    if (!loader)
        return;
    if (loader !== EXTERNAL_LOADER) {
        loader.release(id);
    }
}
export class Preloader {
    #assetIds;
    #progressCallback;
    #loadedAssets = new Set();
    #resolve;
    constructor(assetSources, assetIds, progressCallback) {
        this.#assetIds = new Set(assetIds);
        this.#progressCallback = progressCallback;
        for (const id of this.#assetIds) {
            loadAsset(id, assetSources[id]).then(() => this.markLoaded(id));
        }
    }
    async preload() {
        if (this.#loadedAssets.size === this.#assetIds.size)
            return;
        return new Promise((resolve) => this.#resolve = resolve);
    }
    markLoaded(id) {
        this.#loadedAssets.add(id);
        const total = this.#assetIds.size;
        this.#progressCallback?.(this.#loadedAssets.size / total);
        if (this.#loadedAssets.size === total)
            this.#resolve?.();
    }
}
//# sourceMappingURL=preloader.js.map