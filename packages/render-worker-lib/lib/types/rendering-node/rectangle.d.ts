import { FillInput, Graphics, StrokeInput } from 'pixi.js';
import { RenderableNode } from './renderable';
export declare class RectangleNode extends RenderableNode<Graphics> {
    #private;
    constructor(width: number, height: number, fill: FillInput | undefined, stroke: StrokeInput | undefined);
    get width(): number;
    set width(v: number);
    get height(): number;
    set height(v: number);
    get fill(): FillInput | undefined;
    set fill(v: FillInput | undefined);
    get stroke(): StrokeInput | undefined;
    set stroke(v: StrokeInput | undefined);
}
//# sourceMappingURL=rectangle.d.ts.map