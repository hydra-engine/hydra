import { createObjectStateBuffer } from '../../packages/main-thread-lib/src'
import { initUI } from './ui'

const sab = createObjectStateBuffer()

const logicWorker = new Worker('logic-worker.js')
logicWorker.postMessage({ type: 'init', sab })

const physicsWorker = new Worker('physics-worker.js')
physicsWorker.postMessage({ type: 'init', sab })

const renderWorker = new Worker('render-worker.js')
renderWorker.postMessage({ type: 'init', sab })

initUI()

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
