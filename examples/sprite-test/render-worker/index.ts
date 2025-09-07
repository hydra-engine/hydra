import { loadAsset } from '../../../packages/render-worker-lib/src'
import { ObjectStateTree, Ticker } from '../../../packages/shared/src'
import { assetSources } from '../shared/assets'

let ost: ObjectStateTree
let ticker: Ticker

onmessage = async ({ data }) => {
  const type = data.type

  if (type === 'loadAssets') {
    const assets: number[] = data.assets
    for (const asset of assets) {
      await loadAsset(assetSources[asset])
      postMessage({ type: 'assetLoaded', id: asset })
    }
  }

  if (type === 'init') {
    ost = new ObjectStateTree(data.sab)
    ticker = new Ticker(() => {
      //TODO
    })
  }

  if (type === 'setFpsCap') {
    ticker.setFpsCap(data.fps)
  }
}

export { }
