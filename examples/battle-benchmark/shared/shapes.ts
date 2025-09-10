import { ShapeDescriptor } from '@hydraengine/shared'

export enum ShapeId {
  HP_BAR_BG,
  HP_BAR_FG,

  DEBUG_CHAR_BODY,
  DEBUG_CHAR_HITBOX,
  DEBUG_CHAR_HURTBOX,
  DEBUG_POTION_TRIGGER,
}

export const shapeDescriptors: Record<number, ShapeDescriptor> = {
  [ShapeId.HP_BAR_BG]: { fill: '#000000' },
  [ShapeId.HP_BAR_FG]: { fill: '#ff3b30' },

  [ShapeId.DEBUG_CHAR_BODY]: { stroke: 'yellow' },
  [ShapeId.DEBUG_CHAR_HITBOX]: { stroke: 'red' },
  [ShapeId.DEBUG_CHAR_HURTBOX]: { stroke: 'green' },
  [ShapeId.DEBUG_POTION_TRIGGER]: { stroke: 'green' },
}
