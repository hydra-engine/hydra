export enum RigidbodyType {
  Rectangle,
  Circle,
  Polygon,
}

export type RectangleRigidbody = { type: RigidbodyType.Rectangle, width: number, height: number }
export type CircleRigidbody = { type: RigidbodyType.Circle, radius: number }
export type PolygonRigidbody = { type: RigidbodyType.Polygon, vertices: { x: number, y: number }[] }

export type Rigidbody =
  | RectangleRigidbody
  | CircleRigidbody
  | PolygonRigidbody
