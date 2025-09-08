import { Loader } from './loader'

class FontFamilyLoader extends Loader<boolean> {
  protected override async doLoad(id: number, fontName: string) {
    const loadingPromise = (async () => {
      if ('fonts' in document) {
        try {
          await document.fonts.load(`1em ${fontName}`)
          await document.fonts.ready
          this.loadingPromises.delete(id)
          return true
        } catch (error) {
          console.error(`Failed to load font: ${fontName}`, error)
          this.loadingPromises.delete(id)
        }
      } else {
        console.warn(`This browser does not support the Font Loading API`)
        this.loadingPromises.delete(id)
      }
    })()

    this.loadingPromises.set(id, loadingPromise)
    return await loadingPromise
  }
}

export const fontFamilyLoader = new FontFamilyLoader()
