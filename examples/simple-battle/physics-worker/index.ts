import { PhysicsSimulator } from '@hydraengine/physics-worker-lib'
import { debugMode, enableDebug, ObjectStateTree, Ticker } from '@hydraengine/shared'
import { bodyDescriptors } from '../shared/bodies'
import { worldDescriptors } from '../shared/worlds'

enableDebug()

let ticker: Ticker
let physicsSimulator: PhysicsSimulator
let lastFps = 0

function init(stateTree: ObjectStateTree) {
  physicsSimulator = new PhysicsSimulator(stateTree, worldDescriptors, bodyDescriptors)

  ticker = new Ticker((dt) => {
    lastFps = 1 / dt
    physicsSimulator.update(dt)
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
