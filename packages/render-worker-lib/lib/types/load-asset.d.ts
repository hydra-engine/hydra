import { SpritesheetData } from 'pixi.js';
export type AssetSource = string | {
    src: string;
    atlas: SpritesheetData;
} | {
    fnt: string;
    src: string;
};
export declare function loadAsset(id: number, asset: AssetSource): Promise<void>;
export declare function releaseAsset(id: number): void;
//# sourceMappingURL=load-asset.d.ts.map