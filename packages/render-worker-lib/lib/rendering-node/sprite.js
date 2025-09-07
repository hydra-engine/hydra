import { Sprite as PixiSprite } from 'pixi.js';
import { textureLoader } from '../loaders/texture';
import { RenderableNode } from './renderable';
export class SpriteNode extends RenderableNode {
    #assetId;
    #sprite;
    constructor(assetId) {
        super();
        this.#assetId = assetId;
        this.#load();
    }
    async #load() {
        let texture;
        if (textureLoader.checkCached(this.#assetId)) {
            texture = textureLoader.getCached(this.#assetId);
        }
        else {
            console.info(`Texture not preloaded. Loading now: ${this.#assetId}`);
            texture = await textureLoader.load(this.#assetId);
        }
        this.#sprite?.destroy();
        this.#sprite = undefined;
        if (texture) {
            const s = new PixiSprite({ texture, anchor: 0.5, zIndex: -999999 });
            this.pixiContainer.addChild(s);
            this.#sprite = s;
        }
    }
    remove() {
        textureLoader.release(this.#assetId);
        super.remove();
    }
}
//# sourceMappingURL=sprite.js.map