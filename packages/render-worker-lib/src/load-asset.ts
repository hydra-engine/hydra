import { SpritesheetData } from 'pixi.js'
import { binaryLoader } from './loaders/binary'
import { bitmapFontLoader } from './loaders/bitmap-font'
import { Loader } from './loaders/loader'
import { getCachedAtlasId, spritesheetLoader } from './loaders/spritesheet'
import { textLoader } from './loaders/text'
import { textureLoader } from './loaders/texture'

export type AssetSource = string | {
  src: string
  atlas: SpritesheetData
} | {
  fnt: string
  src: string
}

const loaderForPathMap: Array<{ check: (path: string) => boolean, loader: Loader<any> }> = [
  { check: (p) => p.endsWith('.json') || p.endsWith('.atlas'), loader: textLoader },
  { check: (p) => p.endsWith('.skel'), loader: binaryLoader },
  { check: (p) => /\.(png|jpe?g|gif|webp)$/.test(p), loader: textureLoader },
]

function getLoaderForPath(path: string): Loader<any> | undefined {
  return loaderForPathMap.find(({ check }) => check(path))?.loader
}

export async function loadAsset(asset: AssetSource): Promise<void> {
  if (typeof asset === 'string') {
    const loader = getLoaderForPath(asset)
    if (!loader) {
      console.warn(`No loader found for asset: ${asset}`)
      return
    }
    await loader.load(asset)
  } else if ('atlas' in asset) {
    const id = getCachedAtlasId(asset.src, asset.atlas)
    await spritesheetLoader.load(id, asset.src, asset.atlas)
  } else if ('fnt' in asset) {
    await bitmapFontLoader.load(asset.fnt, asset.src)
  } else {
    console.warn(`Unknown asset type: ${asset}`)
  }
}

export function releaseAsset(asset: AssetSource): void {
  if (typeof asset === 'string') {
    const loader = getLoaderForPath(asset)
    if (!loader) {
      console.warn(`No loader found for asset: ${asset}`)
      return
    }
    loader.release(asset)
  } else if ('atlas' in asset) {
    const id = getCachedAtlasId(asset.src, asset.atlas)
    spritesheetLoader.release(id)
  } else if ('fnt' in asset) {
    bitmapFontLoader.release(asset.fnt)
  } else {
    console.warn(`Unknown asset type: ${asset}`)
  }
}
