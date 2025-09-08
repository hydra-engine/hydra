import { Spritesheet as PixiSpritesheet } from 'pixi.js';
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
            const frames = {};
            for (const [key, value] of Object.entries(atlas.frames)) {
                frames[key] = { frame: value };
            }
            const animations = {};
            for (const [key, value] of Object.entries(atlas.animations)) {
                animations[key] = value.frames;
            }
            const spritesheet = new PixiSpritesheet(texture, { frames, meta: { scale: 1 }, animations });
            await spritesheet.parse();
            this.loadingPromises.delete(id);
            if (this.hasActiveRef(id)) {
                if (this.cachedAssets.has(id)) {
                    textureLoader.release(id);
                    console.error(`Spritesheet already exists: ${src}`);
                }
                else {
                    const data = { atlas, pixiSpritesheet: spritesheet };
                    this.cachedAssets.set(id, data);
                    return data;
                }
            }
            else {
                textureLoader.release(id);
            }
        })();
        this.loadingPromises.set(id, loadingPromise);
        return await loadingPromise;
    }
    cleanup(id, { pixiSpritesheet }) {
        pixiSpritesheet.destroy();
        textureLoader.release(id);
    }
}
export const spritesheetLoader = new SpritesheetLoader();
//# sourceMappingURL=spritesheet.js.map