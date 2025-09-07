import { autoDetectRenderer, Container } from 'pixi.js';
export async function createRenderer(parameters) {
    const root = new Container();
    const pixiRenderer = await autoDetectRenderer({
        canvas: parameters.canvas,
    });
    return {
        root,
        render: () => { pixiRenderer.render(root); }
    };
}
//# sourceMappingURL=createRenderer.js.map