import { Loader } from './loader';
declare class TextLoader extends Loader<string> {
    protected doLoad(id: number, src: string): Promise<string | undefined>;
    load(id: number, src: string): Promise<string | undefined>;
}
export declare const textLoader: TextLoader;
export {};
//# sourceMappingURL=text.d.ts.map