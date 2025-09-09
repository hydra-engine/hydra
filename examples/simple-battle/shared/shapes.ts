export enum ShapeId {
  HP_BAR_BG,
  HP_BAR_FG,
}

export interface ShapeDescriptor {
  fill: string
  alpha?: number
}

export const shapeDescriptors: Record<number, ShapeDescriptor> = {
  [ShapeId.HP_BAR_BG]: { fill: '#000000', alpha: 0.4 },
  [ShapeId.HP_BAR_FG]: { fill: '#ff3b30' },
}
