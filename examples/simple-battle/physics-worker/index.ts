import { applyPhysics } from '../../../packages/physics-worker-lib/src'
onmessage = (event) => applyPhysics(event.data)
