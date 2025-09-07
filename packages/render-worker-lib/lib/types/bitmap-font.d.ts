import { Texture } from 'pixi.js';
export type Char = {
    x: number;
    y: number;
    width: number;
    height: number;
    xoffset: number;
    yoffset: number;
    xadvance: number;
};
export type BitmapFont = {
    src: string;
    chars: Record<number, Char>;
    texture: Texture;
    size: number;
    lineHeight: number;
};
//# sourceMappingURL=bitmap-font.d.ts.map