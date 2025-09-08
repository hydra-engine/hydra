import { Atlas } from '@hydraengine/shared'
import { Dict, Spritesheet as PixiSpritesheet, SpritesheetFrameData } from 'pixi.js'
import { Loader } from './loader'
import { textureLoader } from './texture'

export type SpritesheetData = {
  atlas: Atlas,
  pixiSpritesheet: PixiSpritesheet
}

class SpritesheetLoader extends Loader<SpritesheetData> {
  protected override async doLoad(id: number, src: string, atlas: Atlas) {
    const loadingPromise = (async () => {
      const texture = await textureLoader.load(id, src)
      if (!texture) {
        console.error(`Failed to load texture: ${src}`)
        return
      }

      const frames: Dict<SpritesheetFrameData> = {}
      for (const [key, value] of Object.entries(atlas.frames)) {
        frames[key] = { frame: value }
      }
      const animations: Dict<string[]> = {}
      for (const [key, value] of Object.entries(atlas.animations)) {
        animations[key] = value.frames
      }
      const spritesheet = new PixiSpritesheet(texture, { frames, meta: { scale: 1 }, animations })
      await spritesheet.parse()

      this.loadingPromises.delete(id)

      if (this.hasActiveRef(id)) {
        if (this.cachedAssets.has(id)) {
          textureLoader.release(id)
          console.error(`Spritesheet already exists: ${src}`)
        } else {
          const data = { atlas, pixiSpritesheet: spritesheet }
          this.cachedAssets.set(id, data)
          return data
        }
      } else {
        textureLoader.release(id)
      }
    })()

    this.loadingPromises.set(id, loadingPromise)
    return await loadingPromise
  }

  protected override cleanup(id: number, { pixiSpritesheet }: SpritesheetData) {
    pixiSpritesheet.destroy()
    textureLoader.release(id)
  }

  override async load(id: number, src: string, atlas: Atlas) {
    return await super.load(id, src, atlas)
  }
}

export const spritesheetLoader = new SpritesheetLoader()
