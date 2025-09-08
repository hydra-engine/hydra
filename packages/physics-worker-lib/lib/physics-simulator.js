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
        const dts = dt * 1000;
        const matterDt = dts > 16.666 ? 16.666 : dts;
        const step = ++this.#simulationStep;
        const tree = this.#stateTree;
        tree.forEach((id) => {
            //TODO
        });
    }
}
//# sourceMappingURL=physics-simulator.js.map