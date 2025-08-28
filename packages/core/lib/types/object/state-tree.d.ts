import { SABTree } from '../sab-data-structures/tree';
export declare function createInitialObjectStateBuffer(): SharedArrayBuffer;
export declare class ObjectStateTree extends SABTree {
    constructor(sab: SharedArrayBuffer);
    getX(i: number): number;
    setX(i: number, v: number): void;
    getY(i: number): number;
    setY(i: number, v: number): void;
    getObjectType(i: number): number;
    setObjectType(i: number, v: number): void;
    getAssetId(i: number): number;
    setAssetId(i: number, v: number): void;
}
//# sourceMappingURL=state-tree.d.ts.map