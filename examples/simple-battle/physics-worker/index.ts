import { applyPhysics } from '../../../packages/physics-worker-lib/src'

onmessage = (event) => {
  const type = event.data.type

  if (type === 'init') {
    applyPhysics(event.data.sab)
  }
}
