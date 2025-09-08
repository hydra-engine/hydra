import { AnimatedSpriteObject, RootObject, SpriteObject } from '@hydraengine/logic-worker-lib'
import { debugMode, enableDebug, ObjectStateTree, Ticker } from '@hydraengine/shared'
import { AnimationState } from '../shared/animations'
import { AssetId } from '../shared/assets'

enableDebug()

let ticker: Ticker
let root: RootObject
let lastFps = 0

function init(tree: ObjectStateTree) {
  root = new RootObject(tree)

  for (let i = 0; i < 100; i++) {
    const sprite = new SpriteObject({
      asset: AssetId.Bird,
      x: Math.random() * 800 - 400,
      y: Math.random() * 600 - 300
    })
    root.add(sprite)
  }

  const animatedSprite = new AnimatedSpriteObject({
    asset: AssetId.Fire,
    animation: AnimationState.Fire,
  })
  root.add(animatedSprite)

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
