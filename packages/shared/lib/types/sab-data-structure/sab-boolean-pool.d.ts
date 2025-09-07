export declare class SabBooleanPool {
    #private;
    constructor(sab: SharedArrayBuffer, byteOffset: number, vCount: number, cap: number);
    static bytesRequired(vCount: number, cap: number): number;
    get byteLength(): number;
    set(id: number, vi: number, v: boolean): void;
    get(id: number, vi: number): boolean;
}
//# sourceMappingURL=sab-boolean-pool.d.ts.map