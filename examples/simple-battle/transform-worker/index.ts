import { debugMode, enableDebug, ObjectStateTree, Ticker } from '@hydraengine/shared'
import { updateWorldTransforms } from '@hydraengine/transform-worker-lib'

enableDebug()

let ticker: Ticker
let lastFps = 0

function init(stateTree: ObjectStateTree) {
  ticker = new Ticker((dt) => {
    lastFps = 1 / dt
    updateWorldTransforms(stateTree)
  })

  if (debugMode) setInterval(() => {
    postMessage({ type: 'fps', value: lastFps })
  }, 1000)
}

onmessage = async ({ data }) => {
  const type = data.type

  if (type === 'init') init(new ObjectStateTree(data.sab))
  if (type === 'setFpsCap') ticker.setFpsCap(data.fps)
}

export { }
