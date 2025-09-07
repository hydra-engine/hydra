export declare const ROOT: 0;
export declare class SABTreeLinks {
    #private;
    constructor(sab: SharedArrayBuffer, byteOffset: number, capacity: number);
    static bytesRequired(capacity: number): number;
    get byteLength(): number;
    remove(i: number): void;
    insert(p: number, c: number): void;
    insertAt(p: number, c: number, index: number): void;
    forEach(visitor: (node: number) => void): void;
    sortChildren(p: number, getValue: (node: number) => number): void;
}
//# sourceMappingURL=tree-links.d.ts.map