import Matter, { IChamferableBodyDefinition } from 'matter-js'
import { PhysicsNode } from './physics-node'
import { PhysicsWorld } from './physics-world'

export class PhysicsObject extends PhysicsNode {
  //#matterBody: Matter.Body

  #world?: PhysicsWorld

  constructor(
    width: number,
    height: number,
    fixedRotation: boolean | undefined,
    isStatic: boolean | undefined,
  ) {
    super()

    const bodyOptions: IChamferableBodyDefinition = {
      isStatic: isStatic ?? false
    }

    if (fixedRotation) {
      bodyOptions.inertia = Infinity
      bodyOptions.angularVelocity = 0
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
    this.#world = world

    console.log(world)
  }

  get world() { return this.#world }
}
