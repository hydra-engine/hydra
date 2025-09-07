import { Spritesheet, SpritesheetData } from 'pixi.js';
import { Loader } from './loader';
declare class SpritesheetLoader extends Loader<Spritesheet> {
    protected doLoad(id: number, src: string, atlas: SpritesheetData): Promise<Spritesheet<SpritesheetData> | undefined>;
    protected cleanup(id: number, spritesheet: Spritesheet): void;
}
export declare const spritesheetLoader: SpritesheetLoader;
export {};
//# sourceMappingURL=spritesheet.d.ts.map