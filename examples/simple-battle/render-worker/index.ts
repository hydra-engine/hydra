import { startRendering } from '../../../packages/render-worker-lib/src'

onmessage = (event) => {
  const type = event.data.type

  if (type === 'init') {
    startRendering(event.data.sab)
  }
}
