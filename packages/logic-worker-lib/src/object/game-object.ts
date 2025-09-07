import { ObjectStateTree, ObjectType } from '@hydraengine/shared'

export type GameObjectOptions = {
  x?: number
  y?: number
}

export class GameObject {
  type = ObjectType.GameObject

  #id?: number
  #stateTree?: ObjectStateTree

  #parent?: GameObject
  #children: GameObject[] = []

  protected _rootConfig(id: number, stateTree: ObjectStateTree) {
    this.#id = id
    this.#stateTree = stateTree
  }

  constructor(options?: GameObjectOptions) {
    //TODO
  }

  protected attachToStateTree(parentId: number, stateTree: ObjectStateTree) {
    this.#detachFromStateTree()

    const id = stateTree.newChild(parentId)
    stateTree.setObjectType(id, this.type)

    this.#id = id
    this.#stateTree = stateTree

    for (const child of this.#children) {
      child.attachToStateTree(id, stateTree)
    }

    return id
  }

  #detachFromStateTree() {
    if (this.#id !== undefined && this.#stateTree) this.#stateTree.remove(this.#id)
    this.#id = undefined
    this.#stateTree = undefined
  }

  add(...children: GameObject[]) {
    for (const child of children) {

      if (child.#parent) {
        const idx = child.#parent.#children.indexOf(child)
        if (idx !== -1) child.#parent.#children.splice(idx, 1)
      }

      child.#parent = this
      this.#children.push(child)

      if (this.#id !== undefined && this.#stateTree) {
        child.attachToStateTree(this.#id, this.#stateTree)
      }
    }
  }

  remove() {
    this.#detachFromStateTree()

    if (this.#parent) {
      const idx = this.#parent.#children.indexOf(this)
      if (idx !== -1) this.#parent.#children.splice(idx, 1)
      this.#parent = undefined
    }

    for (const child of this.#children) {
      child.#parent = undefined
      child.remove()
    }
    this.#children.length = 0
  }

  update(dt: number) {
    //TODO
  }
}
