import { Atlas } from '@hydraengine/shared'
import { binaryLoader } from './loaders/binary'
import { bitmapFontLoader } from './loaders/bitmap-font'
import { Loader } from './loaders/loader'
import { spritesheetLoader } from './loaders/spritesheet'
import { textLoader } from './loaders/text'
import { textureLoader } from './loaders/texture'

export type AssetSource = string
  | { src: string; atlas: Atlas }
  | { fnt: string; src: string }

const loaderForPathMap: Array<{ check: (path: string) => boolean, loader: Loader<any> }> = [
  { check: (p) => p.endsWith('.json') || p.endsWith('.atlas'), loader: textLoader },
  { check: (p) => p.endsWith('.skel'), loader: binaryLoader },
  { check: (p) => /\.(png|jpe?g|gif|webp)$/.test(p), loader: textureLoader },
]

function getLoaderForPath(path: string): Loader<any> | undefined {
  return loaderForPathMap.find(({ check }) => check(path))?.loader
}

const idToLoaderMap = new Map<number, Loader<any>>()

export async function loadAsset(id: number, asset: AssetSource): Promise<void> {
  if (typeof asset === 'string') {
    const loader = getLoaderForPath(asset)
    if (!loader) {
      console.warn(`No loader found for asset: ${asset}`)
      return
    }
    idToLoaderMap.set(id, loader)
    await loader.load(id, asset)
  } else if ('atlas' in asset) {
    idToLoaderMap.set(id, spritesheetLoader)
    await spritesheetLoader.load(id, asset.src, asset.atlas)
  } else if ('fnt' in asset) {
    idToLoaderMap.set(id, bitmapFontLoader)
    await bitmapFontLoader.load(id, asset.fnt, asset.src)
  } else {
    console.warn(`Unknown asset type: ${asset}`)
  }
}

export function releaseAsset(id: number): void {
  const loader = idToLoaderMap.get(id)
  if (!loader) {
    console.warn(`No loader found for asset ID: ${id}`)
    return
  }
  loader.release(id)
}
