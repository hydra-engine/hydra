import { AssetSource } from '@hydraengine/shared'
import { audioLoader } from './loaders/audio'
import { fontFamilyLoader } from './loaders/font'
import { Loader } from './loaders/loader'

const loaderForPathMap: Array<{ check: (path: string) => boolean, loader: Loader<any> }> = [
  { check: (p) => /\.(mp3|wav|ogg)$/.test(p), loader: audioLoader },
  { check: (p) => !p.includes('.'), loader: fontFamilyLoader }
]

function getLoaderForPath(path: string): Loader<any> | undefined {
  return loaderForPathMap.find(({ check }) => check(path))?.loader
}

const idToLoaderMap = new Map<number, Loader<any>>()

async function loadAsset(id: number, asset: AssetSource): Promise<void> {
  if (typeof asset === 'string') {
    const loader = getLoaderForPath(asset)
    if (!loader) {
      console.warn(`No loader found for graphic asset: ${asset}`)
      return
    }
    idToLoaderMap.set(id, loader)
    await loader.load(id, asset)
  } else {
    console.warn(`Unknown asset type: ${asset}`)
  }
}

function releaseAsset(id: number): void {
  const loader = idToLoaderMap.get(id)
  if (!loader) {
    console.warn(`No loader found for graphic asset ID: ${id}`)
    return
  }
  loader.release(id)
}

export class Preloader {
  #assetIds: number[]
  #progressCallback?: (progress: number) => void
  #loadedCount = 0
  #loadedSet = new Set<number>()
  #resolvePreload?: () => void
  #preloadPromise: Promise<void>

  constructor(assetIds: number[], progressCallback?: (progress: number) => void) {
    this.#assetIds = assetIds
    this.#progressCallback = progressCallback

    // preload에서 사용할 Promise 미리 생성
    this.#preloadPromise = new Promise<void>((resolve) => {
      this.#resolvePreload = resolve
    })
  }

  async preload(): Promise<void> {
    // 모든 asset이 이미 markLoaded 된 경우 즉시 resolve
    if (this.#loadedCount >= this.#assetIds.length) {
      return
    }
    return this.#preloadPromise
  }

  markLoaded(id: number) {
    if (!this.#assetIds.includes(id)) return // 잘못된 id 무시
    if (this.#loadedSet.has(id)) return // 중복 로딩 방지

    this.#loadedSet.add(id)
    this.#loadedCount++

    const progress = this.#loadedCount / this.#assetIds.length
    if (this.#progressCallback) {
      this.#progressCallback(progress)
    }

    // 모두 로딩 끝나면 preload resolve
    if (this.#loadedCount === this.#assetIds.length) {
      this.#resolvePreload?.()
    }
  }
}
