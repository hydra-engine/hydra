import { Texture } from 'pixi.js';
import { Loader } from './loader';
declare class TextureLoader extends Loader<Texture> {
    protected doLoad(id: number, src: string): Promise<Texture<import("pixi.js").TextureSource<any>> | undefined>;
}
export declare const textureLoader: TextureLoader;
export {};
//# sourceMappingURL=texture.d.ts.map