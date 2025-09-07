import { ObjectStateTree } from '@hydraengine/shared';
export declare class Renderer {
    #private;
    readonly offscreenCanvas: OffscreenCanvas;
    readonly devicePixelRatio: number;
    readonly animationNames: Record<number, string>;
    readonly stateTree: ObjectStateTree;
    constructor(offscreenCanvas: OffscreenCanvas, devicePixelRatio: number, animationNames: Record<number, string>, stateTree: ObjectStateTree);
    render(): void;
}
//# sourceMappingURL=renderer.d.ts.map