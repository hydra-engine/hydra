import { Atlas } from '@hydraengine/shared';
import { Dict, Spritesheet, SpritesheetFrameData } from 'pixi.js';
import { Loader } from './loader';
declare class SpritesheetLoader extends Loader<Spritesheet> {
    protected doLoad(id: number, src: string, atlas: Atlas): Promise<Spritesheet<{
        frames: Dict<SpritesheetFrameData>;
        meta: {
            scale: number;
        };
        animations: Dict<string[]>;
    }> | undefined>;
    protected cleanup(id: number, spritesheet: Spritesheet): void;
    load(id: number, src: string, atlas: Atlas): Promise<Spritesheet<import("pixi.js").SpritesheetData> | undefined>;
}
export declare const spritesheetLoader: SpritesheetLoader;
export {};
//# sourceMappingURL=spritesheet.d.ts.map