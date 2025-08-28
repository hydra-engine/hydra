export declare class SABTree {
    #private;
    constructor(sab: SharedArrayBuffer, capacity: number, bvalueCount: number, uvalueCount: number, fvalueCount: number);
    static bytesRequired(capacity: number, bvalueCount: number, uvalueCount: number, fvalueCount: number): number;
    addChild(p: number): number;
    remove(i: number): void;
    insert(p: number, c: number): void;
    insertAt(p: number, c: number, index: number): void;
    setBValue(i: number, j: number, v: boolean): void;
    getBValue(i: number, j: number): boolean;
    setUValue(i: number, j: number, v: number): void;
    getUValue(i: number, j: number): number;
    setFValue(i: number, j: number, v: number): void;
    getFValue(i: number, j: number): number;
    forEach(visitor: (node: number) => void): void;
    sortChildren(parent: number, uvalueIndex: number): void;
}
//# sourceMappingURL=tree.d.ts.map