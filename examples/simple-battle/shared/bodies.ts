import { BodyDescriptor, RigidbodyType } from '@hydraengine/shared'

export enum BodyId {
  HERO_BODY,
  ORC_BODY,
}

export const bodyDescriptors: Record<number, BodyDescriptor> = {
  [BodyId.HERO_BODY]: { rigidbody: { type: RigidbodyType.Rectangle, width: 30, height: 30 }, fixedRotation: true, isStatic: true },
  [BodyId.ORC_BODY]: { rigidbody: { type: RigidbodyType.Rectangle, width: 30, height: 30 }, fixedRotation: true },
}
