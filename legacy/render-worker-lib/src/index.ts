import { DOMAdapter, WebWorkerAdapter } from 'pixi.js'

DOMAdapter.set(WebWorkerAdapter)

export { Renderer, WebWorkerRenderer } from './renderer'

