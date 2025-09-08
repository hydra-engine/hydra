import { Loader } from './loader';
declare class FontFamilyLoader extends Loader<boolean> {
    protected doLoad(id: number, fontName: string): Promise<true | undefined>;
}
export declare const fontFamilyLoader: FontFamilyLoader;
export {};
//# sourceMappingURL=font.d.ts.map