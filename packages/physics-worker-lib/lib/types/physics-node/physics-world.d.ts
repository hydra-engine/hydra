import Matter from 'matter-js';
import { PhysicsNode } from './physics-node';
export declare class PhysicsWorld extends PhysicsNode {
    #private;
    constructor(gravity: number);
    addBody(body: Matter.Body): void;
    removeBody(body: Matter.Body): void;
    update(matterDt: number): void;
    remove(): void;
}
//# sourceMappingURL=physics-world.d.ts.map