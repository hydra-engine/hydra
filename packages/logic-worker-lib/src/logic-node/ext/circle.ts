import { ObjectStateTree, ObjectType } from '@hydraengine/shared'
import { GameObject, GameObjectOptions } from '../core/game-object'

export type CircleNodeOptions = {
  shape: number
  radius: number
} & GameObjectOptions

export class CircleNode extends GameObject {
  type = ObjectType.Circle

  #shapeId: number
  #radius: number

  constructor(options: CircleNodeOptions) {
    super(options)
    this.#shapeId = options.shape
    this.#radius = options.radius
  }

  get radius() { return this.#radius }
  set radius(v) {
    if (this.#radius !== v) {
      this.#radius = v

      if (this.id !== undefined && this.stateTree) {
        this.stateTree.setRadius(this.id, v)
      }
    }
  }

  protected override attachToStateTree(parentId: number, stateTree: ObjectStateTree) {
    const id = super.attachToStateTree(parentId, stateTree)
    stateTree.setShapeId(id, this.#shapeId)
    stateTree.setRadius(id, this.#radius)
    return id
  }
}
