import { Loader } from './loader';
class TextLoader extends Loader {
    async doLoad(id, src) {
        const loadingPromise = (async () => {
            const response = await fetch(src);
            if (!response.ok) {
                console.error(`Failed to load text: ${src}`);
                return;
            }
            const text = await response.text();
            this.loadingPromises.delete(id);
            if (this.hasActiveRef(id)) {
                if (this.cachedAssets.has(id)) {
                    console.error(`Text already exists: ${src}`);
                }
                else {
                    this.cachedAssets.set(id, text);
                    return text;
                }
            }
        })();
        this.loadingPromises.set(id, loadingPromise);
        return await loadingPromise;
    }
}
export const textLoader = new TextLoader();
//# sourceMappingURL=text.js.map