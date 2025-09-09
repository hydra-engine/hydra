import { ObjectType } from '@hydraengine/shared';
import { GameObject } from '../core/game-object';
export class RectangleNode extends GameObject {
    type = ObjectType.Rectangle;
    #shapeId;
    #width;
    #height;
    constructor(options) {
        super(options);
        this.#shapeId = options.shape;
        this.#width = options.width;
        this.#height = options.height;
    }
    get width() { return this.#width; }
    set width(v) {
        if (this.#width !== v) {
            this.#width = v;
            if (this.id !== undefined && this.stateTree) {
                this.stateTree.setWidth(this.id, v);
            }
        }
    }
    get height() { return this.#height; }
    set height(v) {
        if (this.#height !== v) {
            this.#height = v;
            if (this.id !== undefined && this.stateTree) {
                this.stateTree.setHeight(this.id, v);
            }
        }
    }
    attachToStateTree(parentId, stateTree) {
        const id = super.attachToStateTree(parentId, stateTree);
        stateTree.setShapeId(id, this.#shapeId);
        stateTree.setWidth(id, this.#width);
        stateTree.setHeight(id, this.#height);
        return id;
    }
}
//# sourceMappingURL=rectangle.js.map