import { ObjectStateTree } from '@hydraengine/shared';
import { ColorSource } from 'pixi.js';
import { Camera } from './camera';
export type RendererOptions = {
    logicalWidth?: number;
    logicalHeight?: number;
    backgroundColor?: ColorSource;
    backgroundAlpha?: number;
    layers?: {
        id: number;
        drawOrder: number;
    }[];
};
export declare class Renderer {
    #private;
    readonly offscreenCanvas: OffscreenCanvas;
    readonly devicePixelRatio: number;
    readonly animationNames: Record<number, string>;
    readonly stateTree: ObjectStateTree;
    readonly options?: RendererOptions | undefined;
    camera: Camera;
    canvasWidth: number;
    canvasHeight: number;
    canvasLeft: number;
    canvasTop: number;
    viewportScale: number;
    centerX: number;
    centerY: number;
    constructor(offscreenCanvas: OffscreenCanvas, devicePixelRatio: number, animationNames: Record<number, string>, stateTree: ObjectStateTree, options?: RendererOptions | undefined);
    resize(containerWidth: number, containerHeight: number): void;
    render(): void;
}
//# sourceMappingURL=renderer.d.ts.map