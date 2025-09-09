export declare enum ColliderType {
    Rectangle = 0,
    Circle = 1,
    Ellipse = 2,
    Polygon = 3
}
type Position = {
    x?: number;
    y?: number;
};
export type RectangleCollider = {
    type: ColliderType.Rectangle;
    width: number;
    height: number;
} & Position;
export type CircleCollider = {
    type: ColliderType.Circle;
    radius: number;
} & Position;
export type EllipseCollider = {
    type: ColliderType.Ellipse;
    width: number;
    height: number;
} & Position;
export type PolygonCollider = {
    type: ColliderType.Polygon;
    vertices: {
        x: number;
        y: number;
    }[];
} & Position;
export type Collider = RectangleCollider | CircleCollider | EllipseCollider | PolygonCollider;
export {};
//# sourceMappingURL=colliders.d.ts.map