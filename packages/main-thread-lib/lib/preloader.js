export class Preloader {
    #assetIds;
    #progressCallback;
    #loadedCount = 0;
    #loadedSet = new Set();
    #resolvePreload;
    #preloadPromise;
    constructor(assetIds, progressCallback) {
        this.#assetIds = assetIds;
        this.#progressCallback = progressCallback;
        // preload에서 사용할 Promise 미리 생성
        this.#preloadPromise = new Promise((resolve) => {
            this.#resolvePreload = resolve;
        });
    }
    async preload() {
        // 모든 asset이 이미 markLoaded 된 경우 즉시 resolve
        if (this.#loadedCount >= this.#assetIds.length) {
            return;
        }
        return this.#preloadPromise;
    }
    markLoaded(id) {
        if (!this.#assetIds.includes(id))
            return; // 잘못된 id 무시
        if (this.#loadedSet.has(id))
            return; // 중복 로딩 방지
        this.#loadedSet.add(id);
        this.#loadedCount++;
        const progress = this.#loadedCount / this.#assetIds.length;
        if (this.#progressCallback) {
            this.#progressCallback(progress);
        }
        // 모두 로딩 끝나면 preload resolve
        if (this.#loadedCount === this.#assetIds.length) {
            this.#resolvePreload?.();
        }
    }
}
//# sourceMappingURL=preloader.js.map