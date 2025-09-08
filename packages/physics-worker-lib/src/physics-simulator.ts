import { ObjectStateTree } from '@hydraengine/shared'
import { PhysicsObject } from './physics-node/physics-object'
import { PhysicsWorld } from './physics-node/physics-world'

export class PhysicsSimulator {
  readonly #stateTree: ObjectStateTree

  #worlds = new Map<number, PhysicsWorld>()
  #objects = new Map<number, PhysicsObject>()
  #simulationStep = 0

  constructor(readonly stateTree: ObjectStateTree) {
    this.#stateTree = stateTree
  }

  update(dt: number) {
    const step = ++this.#simulationStep

    const tree = this.#stateTree
    tree.forEach((id) => {
      //TODO
    })
  }
}
