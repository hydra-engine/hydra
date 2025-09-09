export class Loader {
    cachedAssets = new Map();
    loadingPromises = new Map();
    #refCount = new Map();
    #incRefCount(id) { this.#refCount.set(id, (this.#refCount.get(id) || 0) + 1); }
    hasActiveRef(id) { return this.#refCount.get(id) > 0; }
    cleanup(id, asset) { }
    checkCached(id) {
        return this.cachedAssets.has(id);
    }
    getCached(id) {
        if (!this.checkCached(id))
            throw new Error(`Asset not found: ${id}`);
        this.#incRefCount(id);
        return this.cachedAssets.get(id);
    }
    async load(id, ...args) {
        this.#incRefCount(id);
        if (this.checkCached(id))
            return this.cachedAssets.get(id);
        if (this.loadingPromises.has(id))
            return await this.loadingPromises.get(id);
        return await this.doLoad(id, ...args);
    }
    release(id) {
        const refCount = this.#refCount.get(id);
        if (refCount === undefined) {
            console.error(`Asset not found: ${id}`);
            return;
        }
        if (refCount === 1) {
            this.#refCount.delete(id);
            const asset = this.cachedAssets.get(id);
            if (asset) {
                this.cleanup(id, asset);
                this.cachedAssets.delete(id);
            }
        }
        else {
            this.#refCount.set(id, refCount - 1);
        }
    }
}
//# sourceMappingURL=loader.js.map