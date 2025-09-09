import { ObjectType } from '@hydraengine/shared';
import { GameObject } from '../core/game-object';
export class BitmapTextNode extends GameObject {
    type = ObjectType.BitmapText;
    #asset;
    #text;
    constructor(options) {
        super(options);
        this.#asset = options.asset;
        this.#text = options.text;
    }
    get asset() { return this.#asset; }
    set asset(v) {
        if (this.#asset !== v) {
            this.#asset = v;
            if (this.id !== undefined && this.stateTree) {
                this.stateTree.setAssetId(this.id, v);
            }
        }
    }
    attachToStateTree(parentId, stateTree) {
        const id = super.attachToStateTree(parentId, stateTree);
        stateTree.setAssetId(id, this.#asset);
        return id;
    }
}
//# sourceMappingURL=bitmap-text.js.map