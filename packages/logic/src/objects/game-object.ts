import { ObjectStateTree, ObjectType, ROOT } from '@kiwiengine/core'

export type GameObjectOptions = {
  type: ObjectType
}

export class GameObject {
  #options: GameObjectOptions

  protected _id?: number
  protected _tree?: ObjectStateTree

  #parent?: GameObject
  #children: GameObject[] = []

  constructor(options: GameObjectOptions) {
    this.#options = options
  }

  #attach(parentId: number, tree: ObjectStateTree) {
    this.#detach()

    const id = tree.addChild(parentId)
    tree.setObjectType(id, this.#options.type)

    this._id = id
    this._tree = tree

    for (const child of this.#children) {
      child.#attach(id, tree)
    }
  }

  #detach() {
    if (this._id !== undefined && this._tree) {
      this._tree.remove(this._id)
    }
    this._tree = undefined
    this._id = undefined
  }

  add(...children: GameObject[]) {
    for (const child of children) {
      if (child.#parent) {
        const idx = child.#parent.#children.indexOf(child)
        if (idx !== -1) child.#parent.#children.splice(idx, 1)
      }
      child.#parent = this
      this.#children.push(child)

      if (this._id !== undefined && this._tree) {
        child.#attach(this._id, this._tree)
      }
    }
  }

  destroy() {
    this.#detach()

    if (this.#parent) {
      const idx = this.#parent.#children.indexOf(this)
      if (idx !== -1) this.#parent.#children.splice(idx, 1)
      this.#parent = undefined
    }

    for (const child of this.#children) {
      child.#parent = undefined
      child.destroy()
    }
    this.#children.length = 0
  }
}

export class RootObject extends GameObject {
  constructor(tree: ObjectStateTree) {
    super({ type: ObjectType.CONTAINER })
    this._id = ROOT
    this._tree = tree
  }
}
