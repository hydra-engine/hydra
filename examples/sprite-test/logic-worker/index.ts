import { AnimatedSpriteObject, RootObject, SpriteObject } from '@hydraengine/logic-worker-lib'
import { ObjectStateTree, Ticker } from '@hydraengine/shared'
import { AnimationState } from '../shared/animations'
import { AssetId } from '../shared/assets'

let ticker: Ticker
let root: RootObject

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
    fps: 12,
    loop: true,
  })
  root.add(animatedSprite)

  ticker = new Ticker((dt) => {
    root.update(dt)
    root.updateWorldTransform()
  })
}

onmessage = (event) => {
  const type = event.data.type

  if (type === 'init') init(new ObjectStateTree(event.data.sab))
  if (type === 'setFpsCap') ticker.setFpsCap(event.data.fps)
}

export { }
