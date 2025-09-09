import { Rigidbody } from '@hydraengine/shared';
import { PhysicsNode } from './physics-node';
import { PhysicsWorld } from './physics-world';
export declare class PhysicsObject extends PhysicsNode {
    #private;
    isStatic: boolean;
    constructor(x: number, y: number, rigidbody: Rigidbody, fixedRotation: boolean | undefined, isStatic: boolean | undefined);
    set world(world: PhysicsWorld | undefined);
    get world(): PhysicsWorld | undefined;
    get x(): number;
    get y(): number;
    set velocityX(v: number);
    get velocityX(): number;
    set velocityY(v: number);
    get velocityY(): number;
    remove(): void;
}
//# sourceMappingURL=physics-object.d.ts.map