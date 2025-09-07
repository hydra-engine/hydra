import { loadAsset, Renderer } from '@hydraengine/render-worker-lib'
import { ObjectStateTree, Ticker } from '@hydraengine/shared'
import { assetSources } from '../shared/assets'

let ticker: Ticker
let renderer: Renderer

async function loadAssets(assets: number[]) {
  for (const asset of assets) {
    await loadAsset(asset, assetSources[asset])
    postMessage({ type: 'assetLoaded', id: asset })
  }
}

function init(ost: ObjectStateTree) {
  renderer = new Renderer(ost)
  ticker = new Ticker(() => renderer.render())
}

onmessage = async ({ data }) => {
  const type = data.type

  if (type === 'loadAssets') loadAssets(data.assets)
  if (type === 'init') init(new ObjectStateTree(data.sab))
  if (type === 'setFpsCap') ticker.setFpsCap(data.fps)
}

export { }
