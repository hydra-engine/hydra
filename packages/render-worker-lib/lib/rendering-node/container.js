import { Container } from 'pixi.js';
import { RenderableNode } from './renderable';
export class ContainerNode extends RenderableNode {
    constructor() {
        super(new Container());
    }
}
//# sourceMappingURL=container.js.map