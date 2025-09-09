import { EventMap } from '@webtaku/event-emitter';
import { GameNode } from '../core/game-node';
export declare class IntervalNode extends GameNode<EventMap> {
    #private;
    interval: number;
    constructor(interval: number, callback: () => void);
    update(dt: number): void;
}
//# sourceMappingURL=interval.d.ts.map