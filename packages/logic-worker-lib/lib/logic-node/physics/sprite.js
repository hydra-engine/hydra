import { ObjectType } from '@hydraengine/shared';
import { GameObject } from '../core/game-object';
export class SpriteObject extends GameObject {
    type = ObjectType.Sprite;
    #assetId;
    constructor(options) {
        super(options);
        this.#assetId = options.asset;
    }
    attachToStateTree(parentId, stateTree) {
        const id = super.attachToStateTree(parentId, stateTree);
        stateTree.setAssetId(id, this.#assetId);
        return id;
    }
}
//# sourceMappingURL=sprite.js.map