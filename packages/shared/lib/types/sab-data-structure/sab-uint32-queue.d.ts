export declare class SabUint32Queue {
    #private;
    constructor(sab: SharedArrayBuffer, byteOffset: number, cap: number);
    static bytesRequired(cap: number): number;
    get byteLength(): number;
    enqueue(v: number): void;
    dequeue(): number;
}
//# sourceMappingURL=sab-uint32-queue.d.ts.map