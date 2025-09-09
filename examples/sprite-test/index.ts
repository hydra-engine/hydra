import { createObjectStateBuffer, FpsDisplay, Preloader, setStyle } from '@hydraengine/main-thread-lib'
import { debugMode, enableDebug } from '@hydraengine/shared'
import { AssetId, assetSources } from './shared/assets'

enableDebug()

const canvas = document.createElement('canvas')
setStyle(canvas, { position: 'absolute', top: '0', left: '0' })
document.body.appendChild(canvas)
const offscreenCanvas = canvas.transferControlToOffscreen()

const fpsDisplayContainer = document.createElement('div')
setStyle(fpsDisplayContainer, { position: 'absolute', top: '0', left: '0', display: 'flex', flexDirection: 'column' })
document.body.appendChild(fpsDisplayContainer)

const logicWorkerFpsDisplay = debugMode ? new FpsDisplay(fpsDisplayContainer, 'Logic') : undefined
const transformWorkerFpsDisplay = debugMode ? new FpsDisplay(fpsDisplayContainer, 'Transform') : undefined
const renderWorkerFpsDisplay = debugMode ? new FpsDisplay(fpsDisplayContainer, 'Render') : undefined

const logicWorker = new Worker('logic-worker.js')
logicWorker.onmessage = (event) => {
  const type = event.data.type

  if (logicWorkerFpsDisplay && type === 'fps') {
    logicWorkerFpsDisplay.fps = event.data.value
  }
}

const transformWorker = new Worker('transform-worker.js')
transformWorker.onmessage = (event) => {
  const type = event.data.type

  if (transformWorkerFpsDisplay && type === 'fps') {
    transformWorkerFpsDisplay.fps = event.data.value
  }
}

const renderWorker = new Worker('render-worker.js')
renderWorker.onmessage = (event) => {
  const type = event.data.type

  if (type === 'graphicAssetLoaded') {
    preloader.markLoaded(event.data.id)
  }

  if (renderWorkerFpsDisplay && type === 'fps') {
    renderWorkerFpsDisplay.fps = event.data.value
  }
}

const preloader = new Preloader(assetSources, [AssetId.Bird, AssetId.Fire])
renderWorker.postMessage({ type: 'loadGraphicAssets', assets: [AssetId.Bird, AssetId.Fire] })
await preloader.preload()

const sab = createObjectStateBuffer()
const messageChannel = new MessageChannel()

logicWorker.postMessage({ type: 'init', sab, port: messageChannel.port1 }, [messageChannel.port1])
transformWorker.postMessage({ type: 'init', sab })
renderWorker.postMessage({
  type: 'init',
  offscreenCanvas,
  devicePixelRatio: window.devicePixelRatio,
  sab,
  port: messageChannel.port2
}, [offscreenCanvas, messageChannel.port2])

function updateCanvasSize(containerWidth: number, containerHeight: number) {
  const canvasWidth = 800
  const canvasHeight = 600

  const S = Math.min(containerWidth / canvasWidth, containerHeight / canvasHeight)

  const displayWidth = canvasWidth * S
  const displayHeight = canvasHeight * S

  const canvasLeft = (containerWidth - displayWidth) / 2
  const canvasTop = (containerHeight - displayHeight) / 2

  setStyle(canvas, {
    width: `${displayWidth}px`,
    height: `${displayHeight}px`,
    left: `${canvasLeft}px`,
    top: `${canvasTop}px`,
  })

  renderWorker.postMessage({ type: 'resize', containerWidth, containerHeight })
}

updateCanvasSize(window.innerWidth, window.innerHeight)
window.addEventListener('resize', () => updateCanvasSize(window.innerWidth, window.innerHeight))

if (process.env.NODE_ENV === 'development') {
  function setFpsCap(fps: number | undefined) {
    logicWorker.postMessage({ type: 'setFpsCap', fps })
    transformWorker.postMessage({ type: 'setFpsCap', fps })
    renderWorker.postMessage({ type: 'setFpsCap', fps })
  }

  if (!document.hasFocus()) setFpsCap(6)
  window.addEventListener('blur', () => { setFpsCap(6) })
  window.addEventListener('focus', () => { setFpsCap(undefined) })
  window.addEventListener('pageshow', (event: PageTransitionEvent) => {
    if (event.persisted) setFpsCap(undefined)
  })
}
