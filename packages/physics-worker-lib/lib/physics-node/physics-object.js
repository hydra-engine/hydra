import { PhysicsNode } from './physics-node';
export class PhysicsObject extends PhysicsNode {
    //#matterBody: Matter.Body
    #world;
    constructor(width, height, fixedRotation, isStatic) {
        super();
        const bodyOptions = {
            isStatic: isStatic ?? false
        };
        if (fixedRotation) {
            bodyOptions.inertia = Infinity;
            bodyOptions.angularVelocity = 0;
        }
        /*if (r.type === RigidbodyType.Rectangle) {
          this.#matterBody = Matter.Bodies.rectangle(x, y, r.width, r.height, bodyOptions)
        } else if (r.type === RigidbodyType.Circle) {
          this.#matterBody = Matter.Bodies.circle(x, y, r.radius, bodyOptions)
        } else if (r.type === RigidbodyType.Polygon) {
          this.#matterBody = Matter.Bodies.fromVertices(x, y, [r.vertices], bodyOptions)
        } else {
          throw new Error('Invalid rigidbody type')
        }*/
    }
    set world(world) {
        this.#world = world;
        console.log(world);
    }
    get world() { return this.#world; }
}
//# sourceMappingURL=physics-object.js.map