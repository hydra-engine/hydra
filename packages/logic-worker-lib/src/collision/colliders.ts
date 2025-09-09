export enum ColliderType {
  Rectangle,
  Circle,
  Ellipse,
  Polygon,
}

type Position = { x?: number, y?: number }

export type RectangleCollider = { type: ColliderType.Rectangle, width: number, height: number } & Position
export type CircleCollider = { type: ColliderType.Circle, radius: number } & Position
export type EllipseCollider = { type: ColliderType.Ellipse, width: number, height: number } & Position
export type PolygonCollider = { type: ColliderType.Polygon, vertices: { x: number, y: number }[] } & Position

export type Collider =
  | RectangleCollider
  | CircleCollider
  | EllipseCollider
  | PolygonCollider
