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
    set body(body) {
        if (this.#bodyId !== body) {
            this.#bodyId = body;
            if (this.id !== undefined && this.stateTree) {
                this.stateTree.setBodyId(this.id, body);
            }
        }
    }
    get body() { return this.#bodyId; }
    set velocityX(velocity) {
        if (this.#velocityX !== velocity) {
            this.#velocityX = velocity;
            if (this.id !== undefined && this.stateTree) {
                this.stateTree.setVelocityX(this.id, velocity);
            }
        }
    }
    get velocityX() { return this.#velocityX; }
    set velocityY(velocity) {
        if (this.#velocityY !== velocity) {
            this.#velocityY = velocity;
            if (this.id !== undefined && this.stateTree) {
                this.stateTree.setVelocityY(this.id, velocity);
            }
        }
    }
    get velocityY() { return this.#velocityY; }
}
//# sourceMappingURL=physics-object.js.map