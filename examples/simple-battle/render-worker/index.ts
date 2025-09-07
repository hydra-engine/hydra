import { startRendering } from '../../../packages/render-worker-lib/src'
onmessage = (event) => startRendering(event.data)
