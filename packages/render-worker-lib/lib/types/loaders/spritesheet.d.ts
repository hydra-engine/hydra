import { Atlas } from '@hydraengine/shared';
import { Dict, Spritesheet as PixiSpritesheet, SpritesheetFrameData } from 'pixi.js';
import { Loader } from './loader';
export type SpritesheetData = {
    atlas: Atlas;
    pixiSpritesheet: PixiSpritesheet;
};
declare class SpritesheetLoader extends Loader<SpritesheetData> {
    protected doLoad(id: number, src: string, atlas: Atlas): Promise<{
        atlas: Atlas;
        pixiSpritesheet: PixiSpritesheet<{
            frames: Dict<SpritesheetFrameData>;
            meta: {
                scale: number;
            };
            animations: Dict<string[]>;
        }>;
    } | undefined>;
    protected cleanup(id: number, { pixiSpritesheet }: SpritesheetData): void;
}
export declare const spritesheetLoader: SpritesheetLoader;
export {};
//# sourceMappingURL=spritesheet.d.ts.map