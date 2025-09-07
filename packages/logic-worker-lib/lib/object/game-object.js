import { ObjectType } from '@hydraengine/shared';
export class GameObject {
    type = ObjectType.GameObject;
    #id;
    #stateTree;
    #parent;
    #children = [];
    _rootConfig(id, stateTree) {
        this.#id = id;
        this.#stateTree = stateTree;
    }
    constructor(options) {
        //TODO
    }
    #attachToStateTree(parentId, stateTree) {
        this.#detachFromStateTree();
        const id = stateTree.newChild(parentId);
        stateTree.setObjectType(id, this.type);
        this.#id = id;
        this.#stateTree = stateTree;
        for (const child of this.#children) {
            child.#attachToStateTree(id, stateTree);
        }
    }
    #detachFromStateTree() {
        if (this.#id !== undefined && this.#stateTree)
            this.#stateTree.remove(this.#id);
        this.#id = undefined;
        this.#stateTree = undefined;
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
                child.#attachToStateTree(this.#id, this.#stateTree);
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
        //TODO
    }
}
//# sourceMappingURL=game-object.js.map