import { RootObject } from '@hydraengine/logic-worker-lib'
import { debugMode, enableDebug, ObjectStateTree, Ticker } from '@hydraengine/shared'
import { Stage } from './stage'

enableDebug()

let ticker: Ticker
let root: RootObject
let lastFps = 0

function init(tree: ObjectStateTree) {
  root = new RootObject(tree)

  root.add(new Stage())

  ticker = new Ticker((dt) => {
    lastFps = 1 / dt
    root.update(dt)
  })

  if (debugMode) setInterval(() => {
    postMessage({ type: 'fps', value: lastFps })
  }, 1000)
}

onmessage = (event) => {
  const type = event.data.type

  if (type === 'init') init(new ObjectStateTree(event.data.sab))
  if (type === 'setFpsCap') ticker.setFpsCap(event.data.fps)
}

export { }
