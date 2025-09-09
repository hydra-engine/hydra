import { BodyDescriptor, ObjectStateTree, ObjectType, WorldDescriptor } from '@hydraengine/shared'
import { PhysicsObject } from './physics-node/physics-object'
import { PhysicsWorld } from './physics-node/physics-world'

export class PhysicsSimulator {
  readonly #stateTree: ObjectStateTree
  readonly #worldDescriptors: Record<number, WorldDescriptor>
  readonly #bodyDescriptors: Record<number, BodyDescriptor>

  #worlds = new Map<number, PhysicsWorld>()
  #objects = new Map<number, PhysicsObject>()
  #simulationStep = 0

  constructor(
    readonly stateTree: ObjectStateTree,
    readonly worldDescriptors: Record<number, WorldDescriptor>,
    readonly bodyDescriptors: Record<number, BodyDescriptor>,
  ) {
    this.#stateTree = stateTree
    this.#worldDescriptors = worldDescriptors
    this.#bodyDescriptors = bodyDescriptors
  }

  update(dt: number) {
    const dts = dt * 1000
    const matterDt = dts > 16.666 ? 16.666 : dts
    this.#worlds.forEach((world) => world.update(matterDt))

    const step = ++this.#simulationStep
    const tree = this.#stateTree
    tree.forEach((id) => {
      const objectType = tree.getObjectType(id)

      if (objectType === ObjectType.PhysicsWorld) {
        let world = this.#worlds.get(id)
        if (!world) {
          world = new PhysicsWorld(this.#worldDescriptors[id]?.gravity ?? 0)
          this.#worlds.set(id, world)
        }
        world.processedStep = step
      }

      if (objectType === ObjectType.PhysicsObject) {
        let object = this.#objects.get(id)
        if (!object) {
          const bodyId = tree.getBodyId(id)
          const bd = this.#bodyDescriptors[bodyId]
          object = new PhysicsObject(bd.width, bd.height, bd.fixedRotation, bd.isStatic)
          this.#objects.set(id, object)
        }

        if (!object.world) {
          object.world = this.#worlds.get(tree.getParent(id))
        }

        object.processedStep = step
      }
    })

    for (const [id, world] of this.#worlds) {
      if (world.processedStep !== step) {
        this.#worlds.delete(id)
      }
    }

    for (const [id, object] of this.#objects) {
      if (object.processedStep !== step) {
        this.#objects.delete(id)
      }
    }
  }
}
