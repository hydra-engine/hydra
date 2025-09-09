export class LocalTransform {
    #id;
    #stateTree;
    #cachedX = 0;
    #cachedY = 0;
    #cachedScaleX = 1;
    #cachedScaleY = 1;
    #cachedPivotX = 0;
    #cachedPivotY = 0;
    #cachedRotation = 0;
    #cachedCos = 1;
    #cachedSin = 0;
    get x() {
        const id = this.#id;
        const tree = this.#stateTree;
        if (tree && id !== undefined) {
            return tree.getWorldX(id);
        }
        return this.#cachedX;
    }
    set x(v) {
        if (this.x !== v) {
            this.#cachedX = v;
            const id = this.#id;
            const tree = this.#stateTree;
            if (tree && id !== undefined) {
                tree.setLocalX(id, v);
            }
        }
    }
    get y() {
        const id = this.#id;
        const tree = this.#stateTree;
        if (tree && id !== undefined) {
            return tree.getWorldY(id);
        }
        return this.#cachedY;
    }
    set y(v) {
        if (this.y !== v) {
            this.#cachedY = v;
            const id = this.#id;
            const tree = this.#stateTree;
            if (tree && id !== undefined) {
                tree.setLocalY(id, v);
            }
        }
    }
    get scaleX() {
        const id = this.#id;
        const tree = this.#stateTree;
        if (tree && id !== undefined) {
            return tree.getWorldScaleX(id);
        }
        return this.#cachedScaleX;
    }
    set scaleX(v) {
        if (this.scaleX !== v) {
            this.#cachedScaleX = v;
            const id = this.#id;
            const tree = this.#stateTree;
            if (tree && id !== undefined) {
                tree.setLocalScaleX(id, v);
            }
        }
    }
    get scaleY() {
        const id = this.#id;
        const tree = this.#stateTree;
        if (tree && id !== undefined) {
            return tree.getWorldScaleY(id);
        }
        return this.#cachedScaleY;
    }
    set scaleY(v) {
        if (this.scaleY !== v) {
            this.#cachedScaleY = v;
            const id = this.#id;
            const tree = this.#stateTree;
            if (tree && id !== undefined) {
                tree.setLocalScaleY(id, v);
            }
        }
    }
    get pivotX() {
        const id = this.#id;
        const tree = this.#stateTree;
        if (tree && id !== undefined) {
            return tree.getLocalPivotX(id);
        }
        return this.#cachedPivotX;
    }
    set pivotX(v) {
        if (this.pivotX !== v) {
            this.#cachedPivotX = v;
            const id = this.#id;
            const tree = this.#stateTree;
            if (tree && id !== undefined) {
                tree.setLocalPivotX(id, v);
            }
        }
    }
    get pivotY() {
        const id = this.#id;
        const tree = this.#stateTree;
        if (tree && id !== undefined) {
            return tree.getLocalPivotY(id);
        }
        return this.#cachedPivotY;
    }
    set pivotY(v) {
        if (this.pivotY !== v) {
            this.#cachedPivotY = v;
            const id = this.#id;
            const tree = this.#stateTree;
            if (tree && id !== undefined) {
                tree.setLocalPivotY(id, v);
            }
        }
    }
    get rotation() {
        const id = this.#id;
        const tree = this.#stateTree;
        if (tree && id !== undefined) {
            return tree.getLocalRotation(id);
        }
        return this.#cachedRotation;
    }
    set rotation(v) {
        if (this.rotation !== v) {
            this.#cachedRotation = v;
            const cos = Math.cos(v);
            const sin = Math.sin(v);
            this.#cachedCos = cos;
            this.#cachedSin = sin;
            const id = this.#id;
            const tree = this.#stateTree;
            if (tree && id !== undefined) {
                tree.setLocalRotation(id, v);
                tree.setLocalCos(id, cos);
                tree.setLocalSin(id, sin);
            }
        }
    }
    setStateTree(id, tree) {
        this.#id = id;
        this.#stateTree = tree;
        tree.setLocalX(id, this.#cachedX);
        tree.setLocalY(id, this.#cachedY);
        tree.setLocalScaleX(id, this.#cachedScaleX);
        tree.setLocalScaleY(id, this.#cachedScaleY);
        tree.setLocalPivotX(id, this.#cachedPivotX);
        tree.setLocalPivotY(id, this.#cachedPivotY);
        tree.setLocalRotation(id, this.#cachedRotation);
        tree.setLocalCos(id, this.#cachedCos);
        tree.setLocalSin(id, this.#cachedSin);
    }
    clearStateTree() {
        this.#id = undefined;
        this.#stateTree = undefined;
    }
}
//# sourceMappingURL=local-transform.js.map