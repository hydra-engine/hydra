import { AssetSource } from '@hydraengine/shared'
import { audioLoader } from './loaders/audio'
import { fontFamilyLoader } from './loaders/font'
import { Loader } from './loaders/loader'

const EXTERNAL_LOADER = Symbol('EXTERNAL_LOADER')

const loaderForPathMap: Array<{ check: (path: string) => boolean, loader: Loader<any> | typeof EXTERNAL_LOADER }> = [
  { check: (p) => p.endsWith('.json') || p.endsWith('.atlas'), loader: EXTERNAL_LOADER },
  { check: (p) => p.endsWith('.skel'), loader: EXTERNAL_LOADER },
  { check: (p) => /\.(png|jpe?g|gif|webp)$/.test(p), loader: EXTERNAL_LOADER },
  { check: (p) => /\.(mp3|wav|ogg)$/.test(p), loader: audioLoader },
  { check: (p) => !p.includes('.'), loader: fontFamilyLoader }
]

function getLoaderForPath(path: string): Loader<any> | typeof EXTERNAL_LOADER | undefined {
  return loaderForPathMap.find(({ check }) => check(path))?.loader
}

const idToLoaderMap = new Map<number, Loader<any> | typeof EXTERNAL_LOADER>()

async function loadAsset(id: number, asset: AssetSource): Promise<boolean> {
  if (typeof asset === 'string') {
    const loader = getLoaderForPath(asset)
    if (!loader) {
      console.warn(`No loader found for asset: ${asset}`)
      return true
    }
    idToLoaderMap.set(id, loader)
    if (loader === EXTERNAL_LOADER) return false
    await loader.load(id, asset)
    return true
  } else if ('atlas' in asset) {
    idToLoaderMap.set(id, EXTERNAL_LOADER)
    return false
  } else if ('fnt' in asset) {
    idToLoaderMap.set(id, EXTERNAL_LOADER)
    return false
  } else {
    console.warn(`Unknown asset type: ${asset}`)
    return true
  }
}

function releaseAsset(id: number): void {
  const loader = idToLoaderMap.get(id)
  if (!loader) return
  if (loader !== EXTERNAL_LOADER) {
    loader.release(id)
  }
}

export class Preloader {
  #assetIds: Set<number>
  #progressCallback?: (progress: number) => void

  #loadedAssets = new Set<number>()
  #resolve?: () => void

  constructor(
    assetSources: Record<number, AssetSource>,
    assetIds: number[],
    progressCallback?: (progress: number) => void,
  ) {
    this.#assetIds = new Set(assetIds)
    this.#progressCallback = progressCallback

    for (const id of this.#assetIds) {
      loadAsset(id, assetSources[id]).then((internal) => {
        if (internal) this.markLoaded(id)
      })
    }
  }

  async preload(): Promise<void> {
    if (this.#loadedAssets.size === this.#assetIds.size) return
    return new Promise<void>((resolve) => this.#resolve = resolve)
  }

  markLoaded(id: number): void {
    this.#loadedAssets.add(id)
    const total = this.#assetIds.size
    this.#progressCallback?.(this.#loadedAssets.size / total)
    if (this.#loadedAssets.size === total) this.#resolve?.()
  }
}
