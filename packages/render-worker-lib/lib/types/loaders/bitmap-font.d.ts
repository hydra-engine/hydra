import { BitmapFont } from '../bitmap-font';
import { Loader } from './loader';
declare class BitmapFontLoader extends Loader<BitmapFont> {
    protected doLoad(id: number, fnt: string, src: string): Promise<BitmapFont | undefined>;
    protected cleanup(id: number): void;
    load(id: number, fnt: string, src: string): Promise<BitmapFont | undefined>;
}
export declare const bitmapFontLoader: BitmapFontLoader;
export {};
//# sourceMappingURL=bitmap-font.d.ts.map