export class WorldTransform {
    #id;
    #stateTree;
    #x = Number.NEGATIVE_INFINITY;
    #y = Number.NEGATIVE_INFINITY;
    #scaleX = 1;
    #scaleY = 1;
    #rotation = 0;
    cos = 1;
    sin = 0;
    get x() { return this.#x; }
    set x(v) {
        if (this.#x !== v) {
            this.#x = v;
            const id = this.#id;
            const tree = this.#stateTree;
            if (tree && id !== undefined) {
                tree.setWorldX(id, v);
            }
        }
    }
    get y() { return this.#y; }
    set y(v) {
        if (this.#y !== v) {
            this.#y = v;
            const id = this.#id;
            const tree = this.#stateTree;
            if (tree && id !== undefined) {
                tree.setWorldY(id, v);
            }
        }
    }
    get scaleX() { return this.#scaleX; }
    set scaleX(v) {
        if (this.#scaleX !== v) {
            this.#scaleX = v;
            const id = this.#id;
            const tree = this.#stateTree;
            if (tree && id !== undefined) {
                tree.setWorldScaleX(id, v);
            }
        }
    }
    get scaleY() { return this.#scaleY; }
    set scaleY(v) {
        if (this.#scaleY !== v) {
            this.#scaleY = v;
            const id = this.#id;
            const tree = this.#stateTree;
            if (tree && id !== undefined) {
                tree.setWorldScaleY(id, v);
            }
        }
    }
    get rotation() { return this.#rotation; }
    set rotation(v) {
        if (this.#rotation !== v) {
            this.#rotation = v;
            const cos = Math.cos(v);
            const sin = Math.sin(v);
            this.cos = cos;
            this.sin = sin;
            const id = this.#id;
            const tree = this.#stateTree;
            if (tree && id !== undefined) {
                tree.setWorldRotation(id, v);
                tree.setWorldCos(id, cos);
                tree.setWorldSin(id, sin);
            }
        }
    }
    update(parent, local) {
        const rx = local.x * parent.scaleX;
        const ry = local.y * parent.scaleY;
        const pCos = parent.cos;
        const pSin = parent.sin;
        this.scaleX = parent.scaleX * local.scaleX;
        this.scaleY = parent.scaleY * local.scaleY;
        const pivotX = local.pivotX * this.scaleX;
        const pivotY = local.pivotY * this.scaleY;
        const cos = local.cos;
        const sin = local.sin;
        this.x = parent.x + (rx * pCos - ry * pSin) - (pivotX * cos - pivotY * sin);
        this.y = parent.y + (rx * pSin + ry * pCos) - (pivotX * sin + pivotY * cos);
        this.rotation = parent.rotation + local.rotation;
    }
    setStateTree(id, tree) {
        this.#id = id;
        this.#stateTree = tree;
        tree.setWorldX(id, this.#x);
        tree.setWorldY(id, this.#y);
        tree.setWorldScaleX(id, this.#scaleX);
        tree.setWorldScaleY(id, this.#scaleY);
        tree.setWorldRotation(id, this.#rotation);
        tree.setWorldCos(id, this.cos);
        tree.setWorldSin(id, this.sin);
    }
    clearStateTree() {
        this.#id = undefined;
        this.#stateTree = undefined;
    }
}
//# sourceMappingURL=world-transform.js.map