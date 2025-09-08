import { loadAsset, Renderer } from '@hydraengine/render-worker-lib'
import { debugMode, enableDebug, ObjectStateTree, Ticker } from '@hydraengine/shared'
import { animationNames } from '../shared/animations'
import { assetSources } from '../shared/assets'

enableDebug()

let ticker: Ticker
let renderer: Renderer
let lastFps = 0

async function loadAssets(assets: number[]) {
  for (const asset of assets) {
    await loadAsset(asset, assetSources[asset])
    postMessage({ type: 'assetLoaded', id: asset })
  }
}

function init(offscreenCanvas: OffscreenCanvas, devicePixelRatio: number, stateTree: ObjectStateTree) {
  renderer = new Renderer(offscreenCanvas, devicePixelRatio, animationNames, stateTree)
  ticker = new Ticker((dt) => {
    lastFps = 1 / dt
    renderer.render()
  })

  if (debugMode) setInterval(() => {
    postMessage({ type: 'fps', value: lastFps })
  }, 1000)
}

onmessage = async ({ data }) => {
  const type = data.type

  if (type === 'loadAssets') loadAssets(data.assets)
  if (type === 'init') init(data.offscreenCanvas, data.devicePixelRatio, new ObjectStateTree(data.sab))
  if (type === 'setFpsCap') ticker.setFpsCap(data.fps)
  if (type === 'resize') renderer.resize(data.containerWidth, data.containerHeight)
}

export { }
