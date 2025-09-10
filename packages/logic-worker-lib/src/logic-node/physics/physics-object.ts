import { ObjectStateTree, ObjectType } from '@hydraengine/shared'
import { EventMap } from '@webtaku/event-emitter'
import { MessageBridge } from '../../message-bridge'
import { GameObject, GameObjectOptions } from '../core/game-object'

export type PhysicsObjectOptions = {
  body: number
  velocityX?: number
  velocityY?: number
} & GameObjectOptions

export class PhysicsObject<E extends EventMap = EventMap> extends GameObject<E> {
  type = ObjectType.PhysicsObject

  #bodyId: number
  #velocityX: number
  #velocityY: number

  constructor(options: PhysicsObjectOptions) {
    super(options)
    this.#bodyId = options.body
    this.#velocityX = options.velocityX ?? 0
    this.#velocityY = options.velocityY ?? 0
  }

  protected override attachToStateTree(parentId: number, stateTree: ObjectStateTree, messageBridge: MessageBridge) {
    const id = super.attachToStateTree(parentId, stateTree, messageBridge)
    stateTree.setBodyId(id, this.#bodyId)
    stateTree.setVelocityX(id, this.#velocityX)
    stateTree.setVelocityY(id, this.#velocityY)
    return id
  }

  set body(v: number) {
    if (this.#bodyId !== v) {
      this.#bodyId = v

      if (this.id !== undefined && this.stateTree) {
        this.stateTree.setBodyId(this.id, v)
      }
    }
  }

  get body() { return this.#bodyId }

  set velocityX(v: number) {
    if (this.#velocityX !== v) {
      this.#velocityX = v

      if (this.id !== undefined && this.stateTree) {
        this.stateTree.setVelocityX(this.id, v)
      }
    }
  }

  get velocityX() { return this.#velocityX }

  set velocityY(v: number) {
    if (this.#velocityY !== v) {
      this.#velocityY = v

      if (this.id !== undefined && this.stateTree) {
        this.stateTree.setVelocityY(this.id, v)
      }
    }
  }

  get velocityY() { return this.#velocityY }
}
