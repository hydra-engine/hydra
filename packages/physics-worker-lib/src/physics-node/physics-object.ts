import { Rigidbody, RigidbodyType } from '@hydraengine/shared'
import Matter, { IChamferableBodyDefinition } from 'matter-js'
import { PhysicsNode } from './physics-node'
import { PhysicsWorld } from './physics-world'

export class PhysicsObject extends PhysicsNode {
  #matterBody: Matter.Body

  #world?: PhysicsWorld
  isStatic: boolean

  constructor(
    x: number,
    y: number,
    rigidbody: Rigidbody,
    fixedRotation: boolean | undefined,
    isStatic: boolean | undefined,
  ) {
    super()

    this.isStatic = isStatic ?? false

    const bodyOptions: IChamferableBodyDefinition = {
      isStatic: isStatic ?? false
    }

    if (fixedRotation) {
      bodyOptions.inertia = Infinity
      bodyOptions.angularVelocity = 0
    }

    if (rigidbody.type === RigidbodyType.Rectangle) {
      this.#matterBody = Matter.Bodies.rectangle(x, y, rigidbody.width, rigidbody.height, bodyOptions)
    } else if (rigidbody.type === RigidbodyType.Circle) {
      this.#matterBody = Matter.Bodies.circle(x, y, rigidbody.radius, bodyOptions)
    } else if (rigidbody.type === RigidbodyType.Polygon) {
      this.#matterBody = Matter.Bodies.fromVertices(x, y, [rigidbody.vertices], bodyOptions)
    } else {
      throw new Error('Invalid rigidbody type')
    }
  }

  set world(world) {
    if (this.#world !== world) {
      this.#world?.removeBody(this.#matterBody)
      this.#world = world
      world?.addBody(this.#matterBody)
    }
  }
  get world() { return this.#world }

  get x() { return this.#matterBody.position.x }
  get y() { return this.#matterBody.position.y }

  set velocityX(v) { Matter.Body.setVelocity(this.#matterBody, { x: v, y: this.#matterBody.velocity.y }) }
  get velocityX() { return this.#matterBody.velocity.x }

  set velocityY(v) { Matter.Body.setVelocity(this.#matterBody, { x: this.#matterBody.velocity.x, y: v }) }
  get velocityY() { return this.#matterBody.velocity.y }

  remove() {
    this.#world?.removeBody(this.#matterBody)
  }
}
