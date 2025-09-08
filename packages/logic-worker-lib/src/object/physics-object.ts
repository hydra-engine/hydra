import { ObjectType } from '@hydraengine/shared'
import { GameObject } from './game-object'

export class PhysicsObject extends GameObject {
  type = ObjectType.PhysicsObject
}
