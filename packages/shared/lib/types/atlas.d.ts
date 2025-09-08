export interface Frame {
    x: number;
    y: number;
    w: number;
    h: number;
}
export type Animation = {
    frames: string[];
    fps: number;
    loop: boolean;
};
export type Atlas = {
    frames: Record<string, Frame>;
    animations: Record<string, Animation>;
};
//# sourceMappingURL=atlas.d.ts.map