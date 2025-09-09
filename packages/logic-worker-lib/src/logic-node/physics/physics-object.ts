import { ObjectType } from '@hydraengine/shared'
import { EventMap } from '@webtaku/event-emitter'
import { GameObject } from '../core/game-object'

export type PhysicsObjectOptions = {
  body: number
  velocityX?: number
  velocityY?: number
}

export class PhysicsObject<E extends EventMap = EventMap> extends GameObject<E> {
  type = ObjectType.PhysicsObject

  disableCollisions() {
    //TODO
  }
}
