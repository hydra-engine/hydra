export declare abstract class Loader<T> {
    #private;
    protected cachedAssets: Map<number, T>;
    protected loadingPromises: Map<number, Promise<T | undefined>>;
    protected hasActiveRef(id: number): boolean;
    protected abstract doLoad(id: number, ...args: any[]): Promise<T | undefined>;
    protected cleanup(id: number, asset: T): void;
    checkCached(id: number): boolean;
    getCached(id: number): T | undefined;
    load(id: number, ...args: any[]): Promise<T | undefined>;
    release(id: number): void;
}
//# sourceMappingURL=loader.d.ts.map