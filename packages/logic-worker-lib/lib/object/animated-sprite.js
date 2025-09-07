import { ObjectType } from '@hydraengine/shared';
import { GameObject } from './game-object';
export class AnimatedSpriteObject extends GameObject {
    type = ObjectType.AnimatedSprite;
    #assetId;
    #animationId;
    #fps;
    #loop;
    constructor(options) {
        super(options);
        this.#assetId = options.asset;
        this.#animationId = options.animation;
        this.#fps = options.fps;
        this.#loop = options.loop ?? true;
    }
    attachToStateTree(parentId, stateTree) {
        const id = super.attachToStateTree(parentId, stateTree);
        stateTree.setAssetId(id, this.#assetId);
        stateTree.setAnimationId(id, this.#animationId);
        stateTree.setFps(id, this.#fps);
        stateTree.setLoop(id, this.#loop);
        return id;
    }
}
//# sourceMappingURL=animated-sprite.js.map