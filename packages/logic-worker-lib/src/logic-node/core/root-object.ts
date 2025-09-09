import { ObjectStateTree, ROOT_ID } from '@hydraengine/shared'
import { MessageBridge } from '../../message-bridge'
import { GameObject } from './game-object'

export class RootObject extends GameObject {
  constructor(stateTree: ObjectStateTree, messageBridge: MessageBridge) {
    super()
    this.id = ROOT_ID
    this.stateTree = stateTree
    this.messageBridge = messageBridge

    stateTree.setWorldScaleX(ROOT_ID, 1)
    stateTree.setWorldScaleY(ROOT_ID, 1)
    stateTree.setWorldCos(ROOT_ID, 1)
    stateTree.setWorldAlpha(ROOT_ID, 1)
  }
}
