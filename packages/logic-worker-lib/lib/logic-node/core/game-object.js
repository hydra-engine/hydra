import { ObjectType } from '@hydraengine/shared';
import { GameNode } from './game-node';
import { LocalTransform } from './local-transform';
export function isGameObject(v) {
    return v.attachToStateTree !== undefined;
}
export class GameObject extends GameNode {
    type = ObjectType.GameObject;
    #id;
    #stateTree;
    #localTransform = new LocalTransform();
    alpha = 1;
    #layer = 0;
    _rootConfig(id, stateTree) {
        this.#id = id;
        this.#stateTree = stateTree;
    }
    constructor(options) {
        super();
        if (options) {
            if (options.x !== undefined)
                this.x = options.x;
            if (options.y !== undefined)
                this.y = options.y;
            if (options.layer !== undefined)
                this.layer = options.layer;
        }
    }
    attachToStateTree(parentId, stateTree) {
        this.#detachFromStateTree();
        const id = stateTree.newChild(parentId);
        stateTree.setObjectType(id, this.type);
        stateTree.setLocalAlpha(id, this.alpha);
        this.#id = id;
        this.#stateTree = stateTree;
        this.#localTransform.setStateTree(id, stateTree);
        stateTree.setLayer(id, this.#layer);
        for (const child of this.children) {
            if (isGameObject(child)) {
                child.attachToStateTree(id, stateTree);
            }
        }
        return id;
    }
    #detachFromStateTree() {
        if (this.#id !== undefined && this.#stateTree)
            this.#stateTree.remove(this.#id);
        this.#id = undefined;
        this.#stateTree = undefined;
        this.#localTransform.clearStateTree();
    }
    add(...children) {
        super.add(...children);
        if (this.#id !== undefined && this.#stateTree) {
            for (const child of children) {
                if (isGameObject(child)) {
                    child.attachToStateTree(this.#id, this.#stateTree);
                }
            }
        }
    }
    remove() {
        this.#detachFromStateTree();
        super.remove();
    }
    set x(v) { this.#localTransform.x = v; }
    get x() { return this.#localTransform.x; }
    set y(v) { this.#localTransform.y = v; }
    get y() { return this.#localTransform.y; }
    set layer(v) {
        if (this.#layer !== v) {
            this.#layer = v;
            if (this.#id !== undefined && this.#stateTree) {
                this.#stateTree.setLayer(this.#id, v);
            }
        }
    }
    get layer() { return this.#layer; }
}
//# sourceMappingURL=game-object.js.map