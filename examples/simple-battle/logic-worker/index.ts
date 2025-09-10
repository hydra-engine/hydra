import { MessageBridge, RootObject } from '@hydraengine/logic-worker-lib'
import { debugMode, enableDebug, ObjectStateTree, Ticker } from '@hydraengine/shared'
import { Stage } from './stage'

enableDebug()

let ticker: Ticker
let stage: Stage
let lastFps = 0

function init(sab: SharedArrayBuffer, port: MessagePort) {
  const stateTree = new ObjectStateTree(sab)
  const messageBridge = new MessageBridge(port)
  const root = new RootObject(stateTree, messageBridge)

  stage = new Stage()
  stage.on('changeHp', (hp) => postMessage({ type: 'changeHp', hp }))
  stage.on('changeScore', (score) => postMessage({ type: 'changeScore', score }))

  root.add(stage)

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

  if (type === 'init') init(event.data.sab, event.data.port)
  if (type === 'setFpsCap') ticker.setFpsCap(event.data.fps)
  if (type === 'heroMove') stage.heroMove(event.data.r, event.data.d)
  if (type === 'heroRelease') stage.heroRelease()
  if (type === 'heroAttack') stage.heroAttack()
}

export { }
