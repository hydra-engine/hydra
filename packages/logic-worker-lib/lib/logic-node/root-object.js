import { ROOT_ID } from '@hydraengine/shared';
import { GameObject } from './game-object';
export class RootObject extends GameObject {
    constructor(stateTree) {
        super();
        this._rootConfig(ROOT_ID, stateTree);
    }
}
//# sourceMappingURL=root-object.js.map