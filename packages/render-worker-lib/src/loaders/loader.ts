export abstract class Loader<T> {
  protected cachedAssets = new Map<number, T>()
  protected loadingPromises = new Map<number, Promise<T | undefined>>()

  #refCount = new Map<number, number>()
  #incRefCount(id: number) { this.#refCount.set(id, (this.#refCount.get(id) || 0) + 1) }

  protected hasActiveRef(id: number) { return this.#refCount.get(id)! > 0 }
  protected abstract doLoad(id: number, ...args: any[]): Promise<T | undefined>
  protected cleanup(id: number, asset: T): void { /* override to clean up */ }

  checkCached(id: number) {
    return this.cachedAssets.has(id)
  }

  getCached(id: number) {
    if (!this.checkCached(id)) throw new Error(`Asset not found: ${id}`)
    this.#incRefCount(id)
    return this.cachedAssets.get(id)
  }

  async load(id: number, ...args: any[]) {
    this.#incRefCount(id)
    if (this.checkCached(id)) return this.cachedAssets.get(id)
    if (this.loadingPromises.has(id)) return await this.loadingPromises.get(id)
    return await this.doLoad(id, ...args)
  }

  release(id: number) {
    const refCount = this.#refCount.get(id)
    if (refCount === undefined) throw new Error(`Asset not found: ${id}`)
    if (refCount === 1) {
      this.#refCount.delete(id)
      const asset = this.cachedAssets.get(id)
      if (asset) {
        this.cleanup(id, asset)
        this.cachedAssets.delete(id)
      }
    } else {
      this.#refCount.set(id, refCount - 1)
    }
  }
}
