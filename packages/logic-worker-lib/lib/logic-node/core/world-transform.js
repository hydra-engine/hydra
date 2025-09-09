export class WorldTransform {
    #id;
    #stateTree;
    get x() {
        const id = this.#id;
        const tree = this.#stateTree;
        if (tree && id !== undefined) {
            return tree.getWorldX(id);
        }
        return Number.NEGATIVE_INFINITY;
    }
    get y() {
        const id = this.#id;
        const tree = this.#stateTree;
        if (tree && id !== undefined) {
            return tree.getWorldY(id);
        }
        return Number.NEGATIVE_INFINITY;
    }
    get scaleX() {
        const id = this.#id;
        const tree = this.#stateTree;
        if (tree && id !== undefined) {
            return tree.getWorldScaleX(id);
        }
        return 1;
    }
    get scaleY() {
        const id = this.#id;
        const tree = this.#stateTree;
        if (tree && id !== undefined) {
            return tree.getWorldScaleY(id);
        }
        return 1;
    }
    get rotation() {
        const id = this.#id;
        const tree = this.#stateTree;
        if (tree && id !== undefined) {
            return tree.getWorldRotation(id);
        }
        return 0;
    }
    get cos() {
        const id = this.#id;
        const tree = this.#stateTree;
        if (tree && id !== undefined) {
            return tree.getWorldCos(id);
        }
        return 1;
    }
    get sin() {
        const id = this.#id;
        const tree = this.#stateTree;
        if (tree && id !== undefined) {
            return tree.getWorldSin(id);
        }
        return 0;
    }
    setStateTree(id, tree) {
        this.#id = id;
        this.#stateTree = tree;
    }
    clearStateTree() {
        this.#id = undefined;
        this.#stateTree = undefined;
    }
}
//# sourceMappingURL=world-transform.js.map