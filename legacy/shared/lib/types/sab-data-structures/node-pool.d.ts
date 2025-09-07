export declare class SABNodePool {
    #private;
    constructor(sab: SharedArrayBuffer, byteOffset: number, capacity: number);
    static bytesRequired(capacity: number): number;
    get byteLength(): number;
    alloc(): number;
    free(idx: number): void;
}
//# sourceMappingURL=node-pool.d.ts.map