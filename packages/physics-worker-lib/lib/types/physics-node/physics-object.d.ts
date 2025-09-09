import { PhysicsNode } from './physics-node';
import { PhysicsWorld } from './physics-world';
export declare class PhysicsObject extends PhysicsNode {
    #private;
    constructor(width: number, height: number, fixedRotation: boolean | undefined, isStatic: boolean | undefined);
    set world(world: PhysicsWorld | undefined);
    get world(): PhysicsWorld | undefined;
}
//# sourceMappingURL=physics-object.d.ts.map