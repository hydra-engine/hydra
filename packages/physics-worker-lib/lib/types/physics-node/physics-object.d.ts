import { Rigidbody } from '@hydraengine/shared';
import { PhysicsNode } from './physics-node';
import { PhysicsWorld } from './physics-world';
export declare class PhysicsObject extends PhysicsNode {
    #private;
    bodyId: number;
    isStatic: boolean;
    constructor(initialX: number, initialY: number, bodyId: number, rigidbody: Rigidbody, fixedRotation: boolean | undefined, isStatic: boolean | undefined);
    set world(world: PhysicsWorld | undefined);
    get world(): PhysicsWorld | undefined;
    get x(): number;
    get y(): number;
    set velocityX(v: number);
    get velocityX(): number;
    set velocityY(v: number);
    get velocityY(): number;
    changeBody(bodyId: number, rigidbody: Rigidbody): void;
    remove(): void;
}
//# sourceMappingURL=physics-object.d.ts.map