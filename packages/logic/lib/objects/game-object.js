import { ObjectType, ROOT } from '@kiwiengine/core';
export class GameObject {
    #options;
    _id;
    _tree;
    #parent;
    #children = [];
    constructor(options) {
        this.#options = options;
    }
    #attach(parentId, tree) {
        this.#detach();
        for (const child of this.#children) {
            child.id = tree.addChild(parentId);
        }
    }
    #detach() {
        if (!this._tree || this._id === undefined)
            return;
        this._tree.remove(this._id);
        this._tree = undefined;
        this._id = undefined;
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
            if (this._tree)
                child.#attach(this, this._tree);
        }
    }
    destroy() {
        if (this.#parent) {
            const idx = this.#parent.#children.indexOf(this);
            if (idx !== -1)
                this.#parent.#children.splice(idx, 1);
            this.#parent = undefined;
        }
        for (const child of this.#children) {
            child.#parent = undefined;
            child.destroy();
        }
        this.#children.length = 0;
        if (!this._tree || this._id === undefined)
            throw new Error('GameObject is not in a tree');
        this._tree.remove(this._id);
        this._tree = undefined;
        this._id = undefined;
    }
}
export class RootObject extends GameObject {
    constructor(tree) {
        super({ type: ObjectType.CONTAINER });
        this._id = ROOT;
        this._tree = tree;
    }
}
//# sourceMappingURL=game-object.js.map