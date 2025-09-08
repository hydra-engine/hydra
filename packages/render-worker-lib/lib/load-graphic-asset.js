import { binaryLoader } from './loaders/binary';
import { bitmapFontLoader } from './loaders/bitmap-font';
import { spritesheetLoader } from './loaders/spritesheet';
import { textLoader } from './loaders/text';
import { textureLoader } from './loaders/texture';
const loaderForPathMap = [
    { check: (p) => p.endsWith('.json') || p.endsWith('.atlas'), loader: textLoader },
    { check: (p) => p.endsWith('.skel'), loader: binaryLoader },
    { check: (p) => /\.(png|jpe?g|gif|webp)$/.test(p), loader: textureLoader },
];
function getLoaderForPath(path) {
    return loaderForPathMap.find(({ check }) => check(path))?.loader;
}
const idToLoaderMap = new Map();
export async function loadGraphicAsset(id, asset) {
    if (typeof asset === 'string') {
        const loader = getLoaderForPath(asset);
        if (!loader) {
            console.warn(`No loader found for graphic asset: ${asset}`);
            return;
        }
        idToLoaderMap.set(id, loader);
        await loader.load(id, asset);
    }
    else if ('atlas' in asset) {
        idToLoaderMap.set(id, spritesheetLoader);
        await spritesheetLoader.load(id, asset.src, asset.atlas);
    }
    else if ('fnt' in asset) {
        idToLoaderMap.set(id, bitmapFontLoader);
        await bitmapFontLoader.load(id, asset.fnt, asset.src);
    }
    else {
        console.warn(`Unknown asset type: ${asset}`);
    }
}
export function releaseGraphicAsset(id) {
    const loader = idToLoaderMap.get(id);
    if (!loader) {
        console.warn(`No loader found for graphic asset ID: ${id}`);
        return;
    }
    loader.release(id);
}
//# sourceMappingURL=load-graphic-asset.js.map