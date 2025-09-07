export declare class SabFloat32Pool {
    #private;
    constructor(sab: SharedArrayBuffer, byteOffset: number, vCount: number, cap: number);
    static bytesRequired(vCount: number, cap: number): number;
    get byteLength(): number;
    set(id: number, vi: number, v: number): void;
    get(id: number, vi: number): number;
}
//# sourceMappingURL=sab-float32-pool.d.ts.map