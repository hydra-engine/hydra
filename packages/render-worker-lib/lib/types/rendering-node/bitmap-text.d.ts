import { RenderableNode } from './renderable';
export declare class BitmapTextNode extends RenderableNode {
    #private;
    constructor(assetId: number, fnt: string, src: string);
    set text(v: string);
    get text(): string;
    remove(): void;
}
//# sourceMappingURL=bitmap-text.d.ts.map