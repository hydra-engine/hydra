import { ObjectStateTree } from '@kiwiengine/core';
import { ICanvas } from 'pixi.js';
export declare class Renderer {
    #private;
    constructor(canvas: ICanvas, objectStateTree: ObjectStateTree);
    render(): void;
}
export declare class WebWorkerRenderer extends Renderer {
    constructor(canvas: ICanvas, objectStateTree: ObjectStateTree);
}
//# sourceMappingURL=renderer.d.ts.map