import { ObjectType } from '@hydraengine/shared';
import { GameObject } from './game-object';
export class AnimatedSpriteObject extends GameObject {
    type = ObjectType.AnimatedSprite;
    #assetId;
    #animationId;
    constructor(options) {
        super(options);
        this.#assetId = options.asset;
        this.#animationId = options.animation;
    }
    attachToStateTree(parentId, stateTree) {
        const id = super.attachToStateTree(parentId, stateTree);
        stateTree.setAssetId(id, this.#assetId);
        stateTree.setAnimationId(id, this.#animationId);
        return id;
    }
}
//# sourceMappingURL=animated-sprite.js.map