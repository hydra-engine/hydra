import { FillInput, Graphics, StrokeInput } from 'pixi.js';
import { RenderableNode } from './renderable';
export declare class RectangleNode extends RenderableNode<Graphics> {
    #private;
    constructor(width: number, height: number, fill: FillInput | undefined, stroke: StrokeInput | undefined);
    set width(v: number);
    get width(): number;
    set height(v: number);
    get height(): number;
    set fill(v: FillInput | undefined);
    get fill(): FillInput | undefined;
    set stroke(v: StrokeInput | undefined);
    get stroke(): StrokeInput | undefined;
}
//# sourceMappingURL=rectangle.d.ts.map