import { Rigidbody } from './rigidbodies'

export type BodyDescriptor = {
  rigidbody: Rigidbody
  fixedRotation?: boolean
  isStatic?: boolean
}
