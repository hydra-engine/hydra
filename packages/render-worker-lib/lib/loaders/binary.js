import { Loader } from './loader';
class BinaryLoader extends Loader {
    async doLoad(id, src) {
        const loadingPromise = (async () => {
            const response = await fetch(src);
            if (!response.ok) {
                console.error(`Failed to load binary data: ${src}`);
                return;
            }
            const arrayBuffer = await response.arrayBuffer();
            this.loadingPromises.delete(id);
            if (this.hasActiveRef(id)) {
                if (this.cachedAssets.has(id)) {
                    console.error(`Binary data already exists: ${src}`);
                }
                else {
                    const data = new Uint8Array(arrayBuffer);
                    this.cachedAssets.set(id, data);
                    return data;
                }
            }
        })();
        this.loadingPromises.set(id, loadingPromise);
        return await loadingPromise;
    }
    async load(id, src) {
        return await super.load(id, src);
    }
}
export const binaryLoader = new BinaryLoader();
//# sourceMappingURL=binary.js.map