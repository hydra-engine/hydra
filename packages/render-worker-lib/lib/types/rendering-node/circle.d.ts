import { FillInput, Graphics, StrokeInput } from 'pixi.js';
import { RenderableNode } from './renderable';
export declare class CircleNode extends RenderableNode<Graphics> {
    #private;
    constructor(radius: number, fill: FillInput | undefined, stroke: StrokeInput | undefined);
    set radius(v: number);
    get radius(): number;
    set fill(v: FillInput | undefined);
    get fill(): FillInput | undefined;
    set stroke(v: StrokeInput | undefined);
    get stroke(): StrokeInput | undefined;
}
//# sourceMappingURL=circle.d.ts.map