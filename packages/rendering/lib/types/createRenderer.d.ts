import { Container, ICanvas } from 'pixi.js';
export type CreateRendererParameters = {
    canvas: ICanvas;
};
export type Renderer = {
    root: Container;
    render: () => void;
};
export declare function createRenderer(parameters: CreateRendererParameters): Promise<Renderer>;
//# sourceMappingURL=createRenderer.d.ts.map