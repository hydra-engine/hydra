import { ObjectType } from '@hydraengine/shared';
import { GameObject } from '../core/game-object';
export class SpriteNode extends GameObject {
    type = ObjectType.Sprite;
    #assetId;
    constructor(options) {
        super(options);
        this.#assetId = options.asset;
    }
    attachToStateTree(parentId, stateTree, messageBridge) {
        const id = super.attachToStateTree(parentId, stateTree, messageBridge);
        stateTree.setAssetId(id, this.#assetId);
        return id;
    }
}
//# sourceMappingURL=sprite.js.map