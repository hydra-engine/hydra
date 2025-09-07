import { SabTree } from './sab-tree/sab-tree';
export declare class ObjectStateTree extends SabTree {
    constructor(sab: SharedArrayBuffer);
    static bytesRequired(): number;
    setX(id: number, v: number): void;
    getX(id: number): number;
    setY(id: number, v: number): void;
    getY(id: number): number;
    setObjectType(id: number, v: number): void;
    getObjectType(id: number): number;
    setAssetId(id: number, v: number): void;
    getAssetId(id: number): number;
    setAnimationId(id: number, v: number): void;
    getAnimationId(id: number): number;
    setFps(id: number, v: number): void;
    getFps(id: number): number;
    setLoop(id: number, v: boolean): void;
    getLoop(id: number): boolean;
}
//# sourceMappingURL=object-state-tree.d.ts.map