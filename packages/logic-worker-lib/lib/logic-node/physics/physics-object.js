import { ObjectType } from '@hydraengine/shared';
import { GameObject } from '../core/game-object';
export class PhysicsObject extends GameObject {
    type = ObjectType.PhysicsObject;
    #bodyId;
    #velocityX;
    #velocityY;
    constructor(options) {
        super(options);
        this.#bodyId = options.body;
        this.#velocityX = options.velocityX ?? 0;
        this.#velocityY = options.velocityY ?? 0;
    }
    attachToStateTree(parentId, stateTree, messageBridge) {
        const id = super.attachToStateTree(parentId, stateTree, messageBridge);
        stateTree.setBodyId(id, this.#bodyId);
        stateTree.setVelocityX(id, this.#velocityX);
        stateTree.setVelocityY(id, this.#velocityY);
        return id;
    }
    set body(v) {
        if (this.#bodyId !== v) {
            this.#bodyId = v;
            if (this.id !== undefined && this.stateTree) {
                this.stateTree.setBodyId(this.id, v);
            }
        }
    }
    get body() { return this.#bodyId; }
    set velocityX(v) {
        if (this.#velocityX !== v) {
            this.#velocityX = v;
            if (this.id !== undefined && this.stateTree) {
                this.stateTree.setVelocityX(this.id, v);
            }
        }
    }
    get velocityX() { return this.#velocityX; }
    set velocityY(v) {
        if (this.#velocityY !== v) {
            this.#velocityY = v;
            if (this.id !== undefined && this.stateTree) {
                this.stateTree.setVelocityY(this.id, v);
            }
        }
    }
    get velocityY() { return this.#velocityY; }
}
//# sourceMappingURL=physics-object.js.map