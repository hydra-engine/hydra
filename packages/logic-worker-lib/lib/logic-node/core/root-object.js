import { ROOT_ID } from '@hydraengine/shared';
import { GameObject } from './game-object';
export class RootObject extends GameObject {
    constructor(stateTree) {
        super();
        this._rootConfig(ROOT_ID, stateTree);
        stateTree.setWorldScaleX(ROOT_ID, 1);
        stateTree.setWorldScaleY(ROOT_ID, 1);
        stateTree.setWorldCos(ROOT_ID, 1);
        stateTree.setWorldAlpha(ROOT_ID, 1);
    }
}
//# sourceMappingURL=root-object.js.map