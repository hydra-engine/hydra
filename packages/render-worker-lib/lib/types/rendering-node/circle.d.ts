import { FillInput, Graphics, StrokeInput } from 'pixi.js';
import { RenderableNode } from './renderable';
export declare class CircleNode extends RenderableNode<Graphics> {
    #private;
    constructor(radius: number, fill: FillInput | undefined, stroke: StrokeInput | undefined);
    get radius(): number;
    set radius(v: number);
    get fill(): FillInput | undefined;
    set fill(v: FillInput | undefined);
    get stroke(): StrokeInput | undefined;
    set stroke(v: StrokeInput | undefined);
}
//# sourceMappingURL=circle.d.ts.map