import { ObjectType } from '@hydraengine/shared';
import { LocalTransform } from '../local-transform';
export class GameObject {
    type = ObjectType.GameObject;
    #id;
    #stateTree;
    #parent;
    #children = [];
    #localTransform = new LocalTransform();
    alpha = 1;
    #layer = 0;
    _rootConfig(id, stateTree) {
        this.#id = id;
        this.#stateTree = stateTree;
        stateTree.setWorldScaleX(id, 1);
        stateTree.setWorldScaleY(id, 1);
        stateTree.setWorldCos(id, 1);
        stateTree.setWorldAlpha(id, 1);
    }
    constructor(options) {
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
        for (const child of this.#children) {
            child.attachToStateTree(id, stateTree);
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
        for (const child of children) {
            if (child.#parent) {
                const idx = child.#parent.#children.indexOf(child);
                if (idx !== -1)
                    child.#parent.#children.splice(idx, 1);
            }
            child.#parent = this;
            this.#children.push(child);
            if (this.#id !== undefined && this.#stateTree) {
                child.attachToStateTree(this.#id, this.#stateTree);
            }
        }
    }
    remove() {
        this.#detachFromStateTree();
        if (this.#parent) {
            const idx = this.#parent.#children.indexOf(this);
            if (idx !== -1)
                this.#parent.#children.splice(idx, 1);
            this.#parent = undefined;
        }
        for (const child of this.#children) {
            child.#parent = undefined;
            child.remove();
        }
        this.#children.length = 0;
    }
    update(dt) {
        for (const child of this.#children) {
            child.update(dt);
        }
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