export class PhysicsManager {
    stateTree;
    #stateTree;
    #worlds = new Map();
    #objects = new Map();
    constructor(stateTree) {
        this.stateTree = stateTree;
        this.#stateTree = stateTree;
    }
    update(dt) {
        const tree = this.#stateTree;
        tree.forEach((id) => {
            //TODO
        });
    }
}
//# sourceMappingURL=physics-manager.js.map