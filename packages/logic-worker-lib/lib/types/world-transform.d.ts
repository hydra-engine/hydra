import { ObjectStateTree } from '@hydraengine/shared';
export declare class WorldTransform {
    #private;
    cos: number;
    sin: number;
    get x(): number;
    set x(v: number);
    get y(): number;
    set y(v: number);
    get scaleX(): number;
    set scaleX(v: number);
    get scaleY(): number;
    set scaleY(v: number);
    get rotation(): number;
    set rotation(v: number);
    setStateTree(id: number, tree: ObjectStateTree): void;
    clearStateTree(): void;
}
//# sourceMappingURL=world-transform.d.ts.map