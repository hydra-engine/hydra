export declare class SabTreeNodeIdPool {
    #private;
    constructor(sab: SharedArrayBuffer, byteOffset: number, cap: number);
    static bytesRequired(cap: number): number;
    get byteLength(): number;
    alloc(): number;
    free(id: number): void;
}
//# sourceMappingURL=sab-tree-node-id-pool.d.ts.map