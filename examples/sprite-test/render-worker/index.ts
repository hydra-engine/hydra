import { loadAsset, render } from '@hydraengine/render-worker-lib'
import { ObjectStateTree, Ticker } from '@hydraengine/shared'
import { assetSources } from '../shared/assets'

let ost: ObjectStateTree
let ticker: Ticker

onmessage = async ({ data }) => {
  const type = data.type

  if (type === 'loadAssets') {
    const assets: number[] = data.assets
    for (const asset of assets) {
      await loadAsset(asset, assetSources[asset])
      postMessage({ type: 'assetLoaded', id: asset })
    }
  }

  if (type === 'init') {
    ost = new ObjectStateTree(data.sab)
    ticker = new Ticker(() => render(ost))
  }

  if (type === 'setFpsCap') {
    ticker.setFpsCap(data.fps)
  }
}

export { }
