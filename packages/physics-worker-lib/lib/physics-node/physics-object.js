import { RigidbodyType } from '@hydraengine/shared';
import Matter from 'matter-js';
import { PhysicsNode } from './physics-node';
export class PhysicsObject extends PhysicsNode {
    #matterBody;
    #world;
    initialX;
    initialY;
    bodyId;
    #fixedRotation;
    isStatic;
    constructor(initialX, initialY, bodyId, rigidbody, fixedRotation, isStatic) {
        super();
        this.initialX = initialX;
        this.initialY = initialY;
        this.bodyId = bodyId;
        this.#fixedRotation = fixedRotation ?? false;
        this.isStatic = isStatic ?? false;
        this.changeRigidbody(rigidbody);
    }
    set world(world) {
        if (this.#world !== world) {
            this.#world?.removeBody(this.#matterBody);
            this.#world = world;
            world?.addBody(this.#matterBody);
        }
    }
    get world() { return this.#world; }
    get x() { return this.#matterBody.position.x; }
    get y() { return this.#matterBody.position.y; }
    set velocityX(v) { Matter.Body.setVelocity(this.#matterBody, { x: v, y: this.#matterBody.velocity.y }); }
    get velocityX() { return this.#matterBody.velocity.x; }
    set velocityY(v) { Matter.Body.setVelocity(this.#matterBody, { x: this.#matterBody.velocity.x, y: v }); }
    get velocityY() { return this.#matterBody.velocity.y; }
    changeRigidbody(rigidbody) {
        let x = this.initialX;
        let y = this.initialY;
        if (this.#matterBody) {
            x = this.#matterBody.position.x;
            y = this.#matterBody.position.y;
            this.#world?.removeBody(this.#matterBody);
        }
        const bodyOptions = {
            isStatic: this.isStatic ?? false
        };
        if (this.#fixedRotation) {
            bodyOptions.inertia = Infinity;
            bodyOptions.angularVelocity = 0;
        }
        if (rigidbody.type === RigidbodyType.Rectangle) {
            this.#matterBody = Matter.Bodies.rectangle(x, y, rigidbody.width, rigidbody.height, bodyOptions);
        }
        else if (rigidbody.type === RigidbodyType.Circle) {
            this.#matterBody = Matter.Bodies.circle(x, y, rigidbody.radius, bodyOptions);
        }
        else if (rigidbody.type === RigidbodyType.Polygon) {
            this.#matterBody = Matter.Bodies.fromVertices(x, y, [rigidbody.vertices], bodyOptions);
        }
        else {
            throw new Error('Invalid rigidbody type');
        }
        this.#world?.addBody(this.#matterBody);
    }
    remove() {
        this.#world?.removeBody(this.#matterBody);
    }
}
//# sourceMappingURL=physics-object.js.map