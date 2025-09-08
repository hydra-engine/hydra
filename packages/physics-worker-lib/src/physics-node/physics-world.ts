import Matter from 'matter-js'
import { PhysicsNode } from './physics-node'

export class PhysicsWorld extends PhysicsNode {
  #matterEngine = Matter.Engine.create()

  constructor(gravity: number) {
    super()
    this.#matterEngine.gravity.y = gravity
  }

  addBody(body: Matter.Body) { Matter.World.add(this.#matterEngine.world, body) }
  removeBody(body: Matter.Body) { Matter.World.remove(this.#matterEngine.world, body) }
  update(matterDt: number) { Matter.Engine.update(this.#matterEngine, matterDt) }
  remove() { Matter.Engine.clear(this.#matterEngine) }
}
