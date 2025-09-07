import { DOMAdapter, WebWorkerAdapter } from 'pixi.js';
import { createRenderer } from './createRenderer';
export async function createWebWorkerRenderer(parameters) {
    DOMAdapter.set(WebWorkerAdapter);
    return await createRenderer(parameters);
}
//# sourceMappingURL=createWebWorkerRenderer.js.map