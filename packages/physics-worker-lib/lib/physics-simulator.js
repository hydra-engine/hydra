export class PhysicsSimulator {
    stateTree;
    #stateTree;
    #worlds = new Map();
    #objects = new Map();
    #simulationStep = 0;
    constructor(stateTree) {
        this.stateTree = stateTree;
        this.#stateTree = stateTree;
    }
    update(dt) {
        const step = ++this.#simulationStep;
        const tree = this.#stateTree;
        tree.forEach((id) => {
            //TODO
        });
    }
}
//# sourceMappingURL=physics-simulator.js.map