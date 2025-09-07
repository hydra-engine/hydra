import { createObjectStateBuffer, Preloader, setStyle } from '@hydraengine/main-thread-lib'
import { AssetId } from './shared/assets'

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)
const offscreenCanvas = canvas.transferControlToOffscreen()

const logicWorker = new Worker('logic-worker.js')

const renderWorker = new Worker('render-worker.js')
renderWorker.onmessage = (event) => {
  const type = event.data.type
  if (type === 'assetLoaded') {
    preloader.markLoaded(event.data.id)
  }
}

const preloader = new Preloader([AssetId.Bird, AssetId.Fire])
renderWorker.postMessage({ type: 'loadAssets', assets: [AssetId.Bird, AssetId.Fire] })
await preloader.preload()

const sab = createObjectStateBuffer()
logicWorker.postMessage({ type: 'init', sab })
renderWorker.postMessage({
  type: 'init',
  offscreenCanvas,
  devicePixelRatio: window.devicePixelRatio,
  sab
}, [offscreenCanvas])

function updateCanvasSize(containerWidth: number, containerHeight: number) {
  setStyle(canvas, {
    width: `${containerWidth}px`,
    height: `${containerHeight}px`,
  })
  renderWorker.postMessage({ type: 'resize', containerWidth, containerHeight })
}

updateCanvasSize(window.innerWidth, window.innerHeight)
window.addEventListener('resize', () => updateCanvasSize(window.innerWidth, window.innerHeight))

if (process.env.NODE_ENV === 'development') {
  function setFpsCap(fps: number | undefined) {
    logicWorker.postMessage({ type: 'setFpsCap', fps })
    renderWorker.postMessage({ type: 'setFpsCap', fps })
  }

  if (!document.hasFocus()) setFpsCap(6)
  window.addEventListener('blur', () => { setFpsCap(6) })
  window.addEventListener('focus', () => { setFpsCap(undefined) })
  window.addEventListener('pageshow', (event: PageTransitionEvent) => {
    if (event.persisted) setFpsCap(undefined)
  })
}
