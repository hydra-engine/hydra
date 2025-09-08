import Matter from 'matter-js';
import { PhysicsNode } from './physics-node';
export class PhysicsWorld extends PhysicsNode {
    #matterEngine = Matter.Engine.create();
    constructor(gravity) {
        super();
        this.#matterEngine.gravity.y = gravity;
    }
    addBody(body) { Matter.World.add(this.#matterEngine.world, body); }
    removeBody(body) { Matter.World.remove(this.#matterEngine.world, body); }
    update(matterDt) { Matter.Engine.update(this.#matterEngine, matterDt); }
    remove() { Matter.Engine.clear(this.#matterEngine); }
}
//# sourceMappingURL=physics-world.js.map