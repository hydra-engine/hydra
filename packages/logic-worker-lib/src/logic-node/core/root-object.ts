import { ObjectStateTree, ROOT } from '@hydraengine/shared'
import { MessageBridge } from '../../message-bridge'
import { GameObject } from './game-object'

export class RootObject extends GameObject {
  constructor(stateTree: ObjectStateTree, messageBridge: MessageBridge) {
    super()
    this.id = ROOT
    this.stateTree = stateTree
    this.messageBridge = messageBridge

    stateTree.setWorldX(ROOT, 0)
    stateTree.setWorldY(ROOT, 0)
    stateTree.setWorldScaleX(ROOT, 1)
    stateTree.setWorldScaleY(ROOT, 1)
    stateTree.setWorldRotation(ROOT, 0)
    stateTree.setWorldCos(ROOT, 1)
    stateTree.setWorldSin(ROOT, 0)
    stateTree.setWorldAlpha(ROOT, 1)
  }
}
