import { PhysicsObject } from '@hydraengine/logic-worker-lib'

export abstract class Character<E extends EventMap = EventMap> extends PhysicsObject<E & {
  changeHp: (damage: number) => void
  dead: () => void
}> {
}
