import { createObjectStateBuffer, Preloader } from '../../packages/main-thread-lib/src'
import { AssetId } from './shared/assets'

const logicWorker = new Worker('logic-worker.js')

const physicsWorker = new Worker('physics-worker.js')

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
physicsWorker.postMessage({ type: 'init', sab })
renderWorker.postMessage({ type: 'init', sab })

if (process.env.NODE_ENV === 'development') {
  function setFpsCap(fps: number | undefined) {
    logicWorker.postMessage({ type: 'setFpsCap', fps })
    physicsWorker.postMessage({ type: 'setFpsCap', fps })
    renderWorker.postMessage({ type: 'setFpsCap', fps })
  }

  if (!document.hasFocus()) setFpsCap(6)
  window.addEventListener('blur', () => { setFpsCap(6) })
  window.addEventListener('focus', () => { setFpsCap(undefined) })
  window.addEventListener('pageshow', (event: PageTransitionEvent) => {
    if (event.persisted) setFpsCap(undefined)
  })
}
