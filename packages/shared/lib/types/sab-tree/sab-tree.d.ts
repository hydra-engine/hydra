export declare class SabTree {
    #private;
    constructor(sab: SharedArrayBuffer, bCount: number, uCount: number, fCount: number, cap: number);
    static bytesRequired(bCount: number, uCount: number, fCount: number, cap: number): number;
    newChild(p: number): number;
    insertAt(p: number, c: number, idx: number): void;
    remove(id: number): void;
    setBoolean(id: number, vi: number, v: boolean): void;
    getBoolean(id: number, vi: number): boolean;
    setUint32(id: number, vi: number, v: number): void;
    getUint32(id: number, vi: number): number;
    setFloat32(id: number, vi: number, v: number): void;
    getFloat32(id: number, vi: number): number;
    forEach(visitor: (node: number) => void): void;
    sortChildren(parent: number, uint32ValueIdx: number): void;
}
//# sourceMappingURL=sab-tree.d.ts.map