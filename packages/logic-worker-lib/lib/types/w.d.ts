import { ObjectStateTree } from '@hydraengine/shared';
export declare class LocalTransform {
    #private;
    get x(): number;
    set x(v: number);
    get y(): number;
    set y(v: number);
    get scaleX(): number;
    set scaleX(v: number);
    get scaleY(): number;
    set scaleY(v: number);
    get pivotX(): number;
    set pivotX(v: number);
    get pivotY(): number;
    set pivotY(v: number);
    get rotation(): number;
    set rotation(v: number);
    setStateTree(id: number, tree: ObjectStateTree): void;
    clearStateTree(): void;
}
//# sourceMappingURL=w.d.ts.map