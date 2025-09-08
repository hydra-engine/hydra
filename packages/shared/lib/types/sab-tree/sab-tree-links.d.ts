export declare const ROOT_ID: 0;
export declare class SabTreeLinks {
    #private;
    constructor(sab: SharedArrayBuffer, byteOffset: number, cap: number);
    static bytesRequired(cap: number): number;
    get byteLength(): number;
    parent(id: number): number;
    remove(id: number): void;
    insert(p: number, c: number): void;
    insertAt(p: number, c: number, idx: number): void;
    forEach(visitor: (id: number) => void): void;
    sortChildren(p: number, getCompValue: (id: number) => number): void;
}
//# sourceMappingURL=sab-tree-links.d.ts.map