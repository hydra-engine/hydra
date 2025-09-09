import { ObjectType } from '@hydraengine/shared';
import { GameObject } from '../core/game-object';
export class AnimatedSpriteNode extends GameObject {
    type = ObjectType.AnimatedSprite;
    #assetId;
    #animationId;
    constructor(options) {
        super(options);
        this.#assetId = options.asset;
        this.#animationId = options.animation;
    }
    attachToStateTree(parentId, stateTree, messageBridge) {
        const id = super.attachToStateTree(parentId, stateTree, messageBridge);
        stateTree.setAssetId(id, this.#assetId);
        stateTree.setAnimationId(id, this.#animationId);
        return id;
    }
    set animation(animation) {
        if (this.#animationId !== animation) {
            this.#animationId = animation;
            if (this.id !== undefined && this.stateTree) {
                this.stateTree.setAnimationId(this.id, animation);
            }
        }
    }
    get animation() {
        return this.#animationId;
    }
}
//# sourceMappingURL=animated-sprite.js.map