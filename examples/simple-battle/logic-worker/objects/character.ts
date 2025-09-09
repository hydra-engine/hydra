import { PhysicsObject, PhysicsObjectOptions, RectangleCollider } from '@hydraengine/logic-worker-lib'
import { EventMap } from '@webtaku/event-emitter'

export type CharacterOptions = {
  maxHp: number
  hp: number
  body: number
  hitbox: RectangleCollider
  hurtbox: RectangleCollider
} & PhysicsObjectOptions

export abstract class Character<E extends EventMap = EventMap> extends PhysicsObject<E & {
  changeHp: (damage: number) => void
  dead: () => void
}> {
}
