import { Spritesheet, SpritesheetData } from 'pixi.js'
import { Loader } from './loader'
import { textureLoader } from './texture'

const atlasIdCache = new WeakMap<SpritesheetData, Map<string, string>>()
let idCounter = 0

export function getCachedAtlasId(src: string, atlas: SpritesheetData): string {
  let innerMap = atlasIdCache.get(atlas)
  if (!innerMap) {
    innerMap = new Map<string, string>()
    atlasIdCache.set(atlas, innerMap)
  }

  if (!innerMap.has(src)) {
    innerMap.set(src, `${src}#${idCounter++}`)
  }

  return innerMap.get(src)!
}

class SpritesheetLoader extends Loader<Spritesheet> {
  #idToSrc = new Map<string, string>();

  protected override async doLoad(id: string, src: string, atlas: SpritesheetData) {
    this.#idToSrc.set(id, src)

    const loadingPromise = (async () => {
      const texture = await textureLoader.load(src)
      if (!texture) {
        console.error(`Failed to load texture: ${src}`)
        return
      }

      const spritesheet = new Spritesheet(texture, atlas)
      await spritesheet.parse()

      this.loadingPromises.delete(id)

      if (this.hasActiveRef(id)) {
        if (this.cachedAssets.has(id)) {
          textureLoader.release(src)
          console.error(`Spritesheet already exists: ${src}`)
        } else {
          this.cachedAssets.set(id, spritesheet)
          return spritesheet
        }
      } else {
        textureLoader.release(src)
      }
    })()

    this.loadingPromises.set(id, loadingPromise)
    return await loadingPromise
  }

  protected override cleanup(id: string, spritesheet: Spritesheet) {
    spritesheet.destroy()

    const src = this.#idToSrc.get(id)
    if (src) textureLoader.release(src)
  }
}

export const spritesheetLoader = new SpritesheetLoader()
