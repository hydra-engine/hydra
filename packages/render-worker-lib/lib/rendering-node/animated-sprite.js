import { Container, AnimatedSprite as PixiAnimatedSprite } from 'pixi.js';
import { spritesheetLoader } from '../loaders/spritesheet';
import { RenderableNode } from './renderable';
export class AnimatedSpriteNode extends RenderableNode {
    #assetId;
    #src;
    #atlas;
    #animation;
    #sheet;
    #sprite;
    constructor(assetId, src, atlas, animation) {
        super(new Container());
        this.#assetId = assetId;
        this.#src = src;
        this.#atlas = atlas;
        this.#animation = animation;
        this.#load();
    }
    async #load() {
        if (spritesheetLoader.checkCached(this.#assetId)) {
            this.#sheet = spritesheetLoader.getCached(this.#assetId);
        }
        else {
            console.info(`Spritesheet not preloaded. Loading now: ${this.#src}`);
            this.#sheet = await spritesheetLoader.load(this.#assetId, this.#src, this.#atlas);
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
            const a = this.#atlas.animations[this.#animation];
            s.loop = a.loop;
            s.animationSpeed = a.fps / 60;
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