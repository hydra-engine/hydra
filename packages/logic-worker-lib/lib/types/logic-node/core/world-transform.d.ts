import { ObjectStateTree } from '@hydraengine/shared';
export declare class WorldTransform {
    #private;
    get x(): number;
    get y(): number;
    get scaleX(): number;
    get scaleY(): number;
    get rotation(): number;
    get cos(): number;
    get sin(): number;
    setStateTree(id: number, tree: ObjectStateTree): void;
    clearStateTree(): void;
}
//# sourceMappingURL=world-transform.d.ts.map