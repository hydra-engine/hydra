import { Rigidbody, RigidbodyType } from '@hydraengine/shared'
import Matter, { IChamferableBodyDefinition } from 'matter-js'
import { PhysicsNode } from './physics-node'
import { PhysicsWorld } from './physics-world'

export class PhysicsObject extends PhysicsNode {
  #matterBody!: Matter.Body
  #world?: PhysicsWorld

  #initialX: number
  #initialY: number
  bodyId!: number
  #fixedRotation: boolean
  isStatic: boolean

  constructor(
    initialX: number,
    initialY: number,

    bodyId: number,
    rigidbody: Rigidbody,

    fixedRotation: boolean | undefined,
    isStatic: boolean | undefined,
  ) {
    super()

    this.#initialX = initialX
    this.#initialY = initialY
    this.#fixedRotation = fixedRotation ?? false
    this.isStatic = isStatic ?? false

    this.changeBody(bodyId, rigidbody)
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

  changeBody(bodyId: number, rigidbody: Rigidbody) {
    this.bodyId = bodyId

    let x = this.#initialX
    let y = this.#initialY

    if (this.#matterBody) {
      x = this.#matterBody.position.x
      y = this.#matterBody.position.y
      this.#world?.removeBody(this.#matterBody)
    }

    const bodyOptions: IChamferableBodyDefinition = {
      isStatic: this.isStatic ?? false
    }

    if (this.#fixedRotation) {
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

    this.#world?.addBody(this.#matterBody)
  }

  remove() {
    this.#world?.removeBody(this.#matterBody)
  }
}
