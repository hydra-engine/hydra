import { ObjectStateTree, ObjectType } from '@hydraengine/shared'
import { EventMap } from '@webtaku/event-emitter'
import { MessageBridge } from '../../message-bridge'
import { GameObject, GameObjectOptions } from '../core/game-object'

export type PhysicsObjectOptions = {
  world: number
} & GameObjectOptions

export class PhysicsWorld<E extends EventMap = EventMap> extends GameObject<E> {
  type = ObjectType.PhysicsWorld

  #worldId: number

  constructor(options: PhysicsObjectOptions) {
    super(options)
    this.#worldId = options.world
  }

  protected override attachToStateTree(parentId: number, stateTree: ObjectStateTree, messageBridge: MessageBridge) {
    const id = super.attachToStateTree(parentId, stateTree, messageBridge)
    stateTree.setWorldId(id, this.#worldId)
    return id
  }
}
