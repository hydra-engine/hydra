import { ObjectStateTree } from '@hydraengine/shared'

export class LocalTransform {
  #id?: number
  #stateTree?: ObjectStateTree

  #x = 0
  #y = 0
  #scaleX = 1
  #scaleY = 1
  #pivotX = 0
  #pivotY = 0
  #rotation = 0

  cos = 1
  sin = 0

  get x() { return this.#x }
  set x(v) {
    if (this.#x !== v) {
      this.#x = v

      const id = this.#id
      const tree = this.#stateTree
      if (tree && id !== undefined) {
        tree.setLocalX(id, v)
      }
    }
  }

  get y() { return this.#y }
  set y(v) {
    if (this.#y !== v) {
      this.#y = v

      const id = this.#id
      const tree = this.#stateTree
      if (tree && id !== undefined) {
        tree.setLocalY(id, v)
      }
    }
  }

  get scaleX() { return this.#scaleX }
  set scaleX(v) {
    if (this.#scaleX !== v) {
      this.#scaleX = v

      const id = this.#id
      const tree = this.#stateTree
      if (tree && id !== undefined) {
        tree.setLocalScaleX(id, v)
      }
    }
  }

  get scaleY() { return this.#scaleY }
  set scaleY(v) {
    if (this.#scaleY !== v) {
      this.#scaleY = v

      const id = this.#id
      const tree = this.#stateTree
      if (tree && id !== undefined) {
        tree.setLocalScaleY(id, v)
      }
    }
  }

  get pivotX() { return this.#pivotX }
  set pivotX(v) {
    if (this.#pivotX !== v) {
      this.#pivotX = v

      const id = this.#id
      const tree = this.#stateTree
      if (tree && id !== undefined) {
        tree.setLocalPivotX(id, v)
      }
    }
  }

  get pivotY() { return this.#pivotY }
  set pivotY(v) {
    if (this.#pivotY !== v) {
      this.#pivotY = v

      const id = this.#id
      const tree = this.#stateTree
      if (tree && id !== undefined) {
        tree.setLocalPivotY(id, v)
      }
    }
  }

  get rotation() { return this.#rotation }
  set rotation(v) {
    if (this.#rotation !== v) {
      this.#rotation = v

      const cos = Math.cos(v)
      const sin = Math.sin(v)
      this.cos = cos
      this.sin = sin

      const id = this.#id
      const tree = this.#stateTree
      if (tree && id !== undefined) {
        tree.setLocalRotation(id, v)
        tree.setLocalCos(id, cos)
        tree.setLocalSin(id, sin)
      }
    }
  }

  setStateTree(id: number, tree: ObjectStateTree) {
    this.#id = id
    this.#stateTree = tree

    tree.setLocalX(id, this.#x)
    tree.setLocalY(id, this.#y)
    tree.setLocalScaleX(id, this.#scaleX)
    tree.setLocalScaleY(id, this.#scaleY)
    tree.setLocalPivotX(id, this.#pivotX)
    tree.setLocalPivotY(id, this.#pivotY)
    tree.setLocalRotation(id, this.#rotation)
    tree.setLocalCos(id, this.cos)
    tree.setLocalSin(id, this.sin)
  }

  clearStateTree() {
    this.#id = undefined
    this.#stateTree = undefined
  }
}
