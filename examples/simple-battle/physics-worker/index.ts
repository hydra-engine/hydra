import { Ticker } from '../../../packages/shared/src'
import { ObjectStateTree } from '../../../packages/shared/src'

let ost: ObjectStateTree
let ticker: Ticker

onmessage = (event) => {
  const type = event.data.type

  if (type === 'init') {
    ost = new ObjectStateTree(event.data.sab)
    ticker = new Ticker(() => {
      //TODO
    })
  }

  if (type === 'setFpsCap') {
    ticker.setFpsCap(event.data.fps)
  }
}

export { }
