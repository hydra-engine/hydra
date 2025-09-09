import { ObjectType } from '@hydraengine/shared';
import { GameObject } from '../core/game-object';
export class PhysicsWorld extends GameObject {
    type = ObjectType.PhysicsWorld;
    #worldId;
    constructor(options) {
        super(options);
        this.#worldId = options.world;
    }
    attachToStateTree(parentId, stateTree, messageBridge) {
        const id = super.attachToStateTree(parentId, stateTree, messageBridge);
        stateTree.setWorldId(id, this.#worldId);
        return id;
    }
}
//# sourceMappingURL=physics-world.js.map