export declare class SABUint32Queue {
    #private;
    constructor(sab: SharedArrayBuffer, byteOffset: number, capacity: number);
    static bytesRequired(capacity: number): number;
    get byteLength(): number;
    enqueue(v: number): void;
    dequeue(): number;
}
//# sourceMappingURL=queue.d.ts.map