import { initUI } from './ui'

const sab = new SharedArrayBuffer(1024)

const logicWorker = new Worker('logic-worker.js')
logicWorker.postMessage({ type: 'init', sab })

const physicsWorker = new Worker('physics-worker.js')
physicsWorker.postMessage({ type: 'init', sab })

const renderWorker = new Worker('render-worker.js')
renderWorker.postMessage({ type: 'init', sab })

initUI()
