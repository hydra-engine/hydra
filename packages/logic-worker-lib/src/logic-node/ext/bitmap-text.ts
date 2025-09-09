import { ObjectStateTree, ObjectType } from '@hydraengine/shared'
import { EventMap } from '@webtaku/event-emitter'
import { MessageBridge } from '../../message-bridge'
import { GameObject, GameObjectOptions } from '../core/game-object'

export type BitmapTextNodeOptions = {
  asset: number
  text: string
} & GameObjectOptions

export class BitmapTextNode<E extends EventMap = EventMap> extends GameObject<E> {
  type = ObjectType.BitmapText

  #asset: number
  #text: string

  constructor(options: BitmapTextNodeOptions) {
    super(options)
    this.#asset = options.asset
    this.#text = options.text
  }

  get asset() { return this.#asset }
  set asset(v) {
    if (this.#asset !== v) {
      this.#asset = v

      if (this.id !== undefined && this.stateTree) {
        this.stateTree.setAssetId(this.id, v)
      }
    }
  }

  protected override attachToStateTree(parentId: number, stateTree: ObjectStateTree, messageBridge: MessageBridge) {
    const id = super.attachToStateTree(parentId, stateTree, messageBridge)
    stateTree.setAssetId(id, this.#asset)
    messageBridge.sendTextToRenderWorker(id, this.#text)
    return id
  }
}
