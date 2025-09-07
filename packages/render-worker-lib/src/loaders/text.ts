import { Loader } from './loader'

class TextLoader extends Loader<string> {
  protected override async doLoad(src: string) {
    const loadingPromise = (async () => {
      const response = await fetch(src)
      if (!response.ok) {
        console.error(`Failed to load text: ${src}`)
        return
      }

      const text = await response.text()

      this.loadingPromises.delete(src)

      if (this.hasActiveRef(src)) {
        if (this.cachedAssets.has(src)) {
          console.error(`Text already exists: ${src}`)
        } else {
          this.cachedAssets.set(src, text)
          return text
        }
      }
    })()

    this.loadingPromises.set(src, loadingPromise)
    return await loadingPromise
  }
}

export const textLoader = new TextLoader()
