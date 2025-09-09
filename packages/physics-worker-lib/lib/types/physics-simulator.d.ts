import { BodyDescriptor, ObjectStateTree, WorldDescriptor } from '@hydraengine/shared';
export declare class PhysicsSimulator {
    #private;
    readonly stateTree: ObjectStateTree;
    readonly worldDescriptors: Record<number, WorldDescriptor>;
    readonly bodyDescriptors: Record<number, BodyDescriptor>;
    constructor(stateTree: ObjectStateTree, worldDescriptors: Record<number, WorldDescriptor>, bodyDescriptors: Record<number, BodyDescriptor>);
    update(dt: number): void;
}
//# sourceMappingURL=physics-simulator.d.ts.map