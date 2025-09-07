import { AnimatedSprite as PixiAnimatedSprite } from 'pixi.js';
import { spritesheetLoader } from '../loaders/spritesheet';
import { RenderableNode } from './renderable';
export class AnimatedSpriteNode extends RenderableNode {
    #assetId;
    #animation;
    #fps;
    #loop;
    #sheet;
    #sprite;
    constructor(assetId, animation, fps, loop) {
        super();
        this.#assetId = assetId;
        this.#animation = animation;
        this.#fps = fps;
        this.#loop = loop;
        this.#load();
    }
    async #load() {
        if (spritesheetLoader.checkCached(this.#assetId)) {
            this.#sheet = spritesheetLoader.getCached(this.#assetId);
        }
        else {
            console.info(`Spritesheet not preloaded. Loading now: ${this.#assetId}`);
            this.#sheet = await spritesheetLoader.load(this.#assetId);
        }
        this.#updateAnimation();
    }
    #updateAnimation() {
        this.#sprite?.destroy();
        this.#sprite = undefined;
        if (this.#sheet) {
            if (!this.#sheet.animations[this.#animation]) {
                console.error(`Animation not found: ${this.#animation}`);
                return;
            }
            const s = new PixiAnimatedSprite(this.#sheet.animations[this.#animation]);
            s.anchor.set(0.5, 0.5);
            s.loop = this.#loop;
            s.animationSpeed = (this.#fps ?? 0) / 60;
            s.play();
            this.pixiContainer.addChild(s);
            this.#sprite = s;
        }
    }
    remove() {
        spritesheetLoader.release(this.#assetId);
        super.remove();
    }
}
//# sourceMappingURL=animated-sprite.js.map