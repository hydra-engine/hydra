import { Loader } from './loader';
declare class BinaryLoader extends Loader<Uint8Array> {
    protected doLoad(id: number, src: string): Promise<Uint8Array<ArrayBuffer> | undefined>;
    load(id: number, src: string): Promise<Uint8Array<ArrayBufferLike> | undefined>;
}
export declare const binaryLoader: BinaryLoader;
export {};
//# sourceMappingURL=binary.d.ts.map