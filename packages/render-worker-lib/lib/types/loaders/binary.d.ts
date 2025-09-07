import { Loader } from './loader';
declare class BinaryLoader extends Loader<Uint8Array> {
    protected doLoad(id: number, src: string): Promise<Uint8Array<ArrayBuffer> | undefined>;
}
export declare const binaryLoader: BinaryLoader;
export {};
//# sourceMappingURL=binary.d.ts.map