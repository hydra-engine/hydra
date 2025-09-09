import { PhysicsObject } from '@hydraengine/logic-worker-lib'
import { EventMap } from '@webtaku/event-emitter'

export abstract class Character<E extends EventMap = EventMap> extends PhysicsObject<E & {
  changeHp: (damage: number) => void
  dead: () => void
}> {
}
