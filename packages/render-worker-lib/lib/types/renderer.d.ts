import { ObjectStateTree } from '@hydraengine/shared';
export declare class Renderer {
    #private;
    readonly offscreenCanvas: OffscreenCanvas;
    readonly devicePixelRatio: number;
    readonly stateTree: ObjectStateTree;
    constructor(offscreenCanvas: OffscreenCanvas, devicePixelRatio: number, stateTree: ObjectStateTree);
    render(): void;
}
//# sourceMappingURL=renderer.d.ts.map