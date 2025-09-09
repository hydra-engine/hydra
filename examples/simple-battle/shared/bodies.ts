export enum BodyId {
  HERO_BODY,
  ORC_BODY,
}

export interface BodyDescriptor {
  width: number
  height: number
  isStatic?: boolean
}

export const bodyDescriptors: Record<number, BodyDescriptor> = {
  [BodyId.HERO_BODY]: { width: 30, height: 30, isStatic: true },
  [BodyId.ORC_BODY]: { width: 30, height: 30 },
}
