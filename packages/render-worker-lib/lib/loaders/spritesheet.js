import { Spritesheet } from 'pixi.js';
import { Loader } from './loader';
import { textureLoader } from './texture';
class SpritesheetLoader extends Loader {
    async doLoad(id, src, atlas) {
        const loadingPromise = (async () => {
            const texture = await textureLoader.load(id, src);
            if (!texture) {
                console.error(`Failed to load texture: ${src}`);
                return;
            }
            const spritesheet = new Spritesheet(texture, atlas);
            await spritesheet.parse();
            this.loadingPromises.delete(id);
            if (this.hasActiveRef(id)) {
                if (this.cachedAssets.has(id)) {
                    textureLoader.release(id);
                    console.error(`Spritesheet already exists: ${src}`);
                }
                else {
                    this.cachedAssets.set(id, spritesheet);
                    return spritesheet;
                }
            }
            else {
                textureLoader.release(id);
            }
        })();
        this.loadingPromises.set(id, loadingPromise);
        return await loadingPromise;
    }
    cleanup(id, spritesheet) {
        spritesheet.destroy();
        textureLoader.release(id);
    }
}
export const spritesheetLoader = new SpritesheetLoader();
//# sourceMappingURL=spritesheet.js.map