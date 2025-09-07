import { Ticker } from '../../../packages/shared/src/'

let sab: SharedArrayBuffer
let ticker: Ticker

onmessage = (event) => {
  const type = event.data.type

  if (type === 'init') {
    sab = event.data.sab
    ticker = new Ticker(() => {
      //TODO
    })
  }

  if (type === 'setFpsCap') {
    ticker.setFpsCap(event.data.fps)
  }
}

export { }
