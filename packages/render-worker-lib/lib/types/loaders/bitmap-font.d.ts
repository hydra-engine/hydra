import { BitmapFont, Char } from '../bitmap-font';
import { Loader } from './loader';
declare class BitmapFontLoader extends Loader<BitmapFont> {
    protected doLoad(id: number, fnt: string, src: string): Promise<{
        src: string;
        chars: Record<number, Char>;
        texture: import("pixi.js").Texture<import("pixi.js").TextureSource<any>>;
        size: number;
        lineHeight: number;
    } | undefined>;
    protected cleanup(id: number): void;
}
export declare const bitmapFontLoader: BitmapFontLoader;
export {};
//# sourceMappingURL=bitmap-font.d.ts.map