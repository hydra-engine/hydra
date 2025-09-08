import { Atlas } from '@hydraengine/shared';
export type AssetSource = string | {
    src: string;
    atlas: Atlas;
} | {
    fnt: string;
    src: string;
};
export declare function loadAsset(id: number, asset: AssetSource): Promise<void>;
export declare function releaseAsset(id: number): void;
//# sourceMappingURL=load-asset.d.ts.map