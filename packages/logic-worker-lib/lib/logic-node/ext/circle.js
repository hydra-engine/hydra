import { ObjectType } from '@hydraengine/shared';
import { GameObject } from '../core/game-object';
export class CircleNode extends GameObject {
    type = ObjectType.Circle;
    #shapeId;
    #radius;
    constructor(options) {
        super(options);
        this.#shapeId = options.shape;
        this.#radius = options.radius;
    }
    get radius() { return this.#radius; }
    set radius(v) {
        if (this.#radius !== v) {
            this.#radius = v;
            if (this.id !== undefined && this.stateTree) {
                this.stateTree.setRadius(this.id, v);
            }
        }
    }
    attachToStateTree(parentId, stateTree) {
        const id = super.attachToStateTree(parentId, stateTree);
        stateTree.setShapeId(id, this.#shapeId);
        stateTree.setRadius(id, this.#radius);
        return id;
    }
}
//# sourceMappingURL=circle.js.map