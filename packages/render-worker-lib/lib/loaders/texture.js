import { Texture } from 'pixi.js';
import { Loader } from './loader';
class TextureLoader extends Loader {
    async doLoad(id, src) {
        const loadingPromise = (async () => {
            const response = await fetch(src);
            if (!response.ok) {
                console.error(`Failed to load texture: ${src}`);
                return;
            }
            const blob = await response.blob();
            const bitmap = await createImageBitmap(blob, { premultiplyAlpha: 'premultiply' });
            this.loadingPromises.delete(id);
            if (this.hasActiveRef(id)) {
                if (this.cachedAssets.has(id)) {
                    console.error(`Texture already exists: ${src}`);
                }
                else {
                    const texture = Texture.from(bitmap);
                    texture.source.scaleMode = 'nearest';
                    this.cachedAssets.set(id, texture);
                    return texture;
                }
            }
        })();
        this.loadingPromises.set(id, loadingPromise);
        return await loadingPromise;
    }
}
export const textureLoader = new TextureLoader();
//# sourceMappingURL=texture.js.map