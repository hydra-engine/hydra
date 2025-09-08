import { ObjectStateTree } from '@hydraengine/shared';
export declare class PhysicsSimulator {
    #private;
    readonly stateTree: ObjectStateTree;
    constructor(stateTree: ObjectStateTree);
    update(dt: number): void;
}
//# sourceMappingURL=physics-simulator.d.ts.map