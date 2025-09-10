import { loadGraphicAsset, MessageBridge, Renderer } from '@hydraengine/render-worker-lib'
import { debugMode, enableDebug, ObjectStateTree, Ticker } from '@hydraengine/shared'
import { animationNames } from '../shared/animations'
import { assetSources } from '../shared/assets'
import { Layer } from '../shared/layers'
import { shapeDescriptors } from '../shared/shapes'

enableDebug()

let ticker: Ticker
let renderer: Renderer
let lastFps = 0

async function loadGraphicAssets(assets: number[]) {
  for (const asset of assets) {
    await loadGraphicAsset(asset, assetSources[asset])
    postMessage({ type: 'graphicAssetLoaded', id: asset })
  }
}

function init(offscreenCanvas: OffscreenCanvas, devicePixelRatio: number, sab: SharedArrayBuffer, port: MessagePort) {
  const stateTree = new ObjectStateTree(sab)
  const messageBridge = new MessageBridge(port)

  renderer = new Renderer(offscreenCanvas, devicePixelRatio, animationNames, assetSources, shapeDescriptors, stateTree, messageBridge, {
    backgroundColor: '#304C79',
    layers: [
      { id: Layer.HUD, drawOrder: 1 }
    ],
  })

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

  if (type === 'loadGraphicAssets') loadGraphicAssets(data.assets)
  if (type === 'init') init(data.offscreenCanvas, data.devicePixelRatio, data.sab, data.port)
  if (type === 'setFpsCap') ticker.setFpsCap(data.fps)
  if (type === 'resize') renderer.resize(data.containerWidth, data.containerHeight)
}

export { }
