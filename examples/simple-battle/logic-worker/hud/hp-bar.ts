import { GameObject, GameObjectOptions, RectangleNode } from '@hydraengine/logic-worker-lib'
import { ShapeId } from '../../shared/shapes'

const HP_BAR_WIDTH = 26

export type HpBarOptions = {
  maxHp: number
  hp: number
} & GameObjectOptions

export class HpBar extends GameObject {
  #bg = new RectangleNode({ shape: ShapeId.HP_BAR_BG, width: HP_BAR_WIDTH, height: 4 })
  #fg = new RectangleNode({ shape: ShapeId.HP_BAR_FG, width: HP_BAR_WIDTH, height: 4 })

  #maxHp: number
  #hp: number

  constructor(options: HpBarOptions) {
    super(options)
    this.#maxHp = options.maxHp
    this.#hp = options.hp
    this.add(this.#bg, this.#fg)
    this.#updateFg()
  }

  #updateFg() {
    const ratio = Math.max(0, Math.min(1, this.#hp / this.#maxHp))
    const newWidth = HP_BAR_WIDTH * ratio
    this.#fg.width = newWidth
    this.#fg.x = -(HP_BAR_WIDTH - newWidth) / 2
  }

  set hp(hp: number) {
    this.#hp = hp
    this.#updateFg()
  }

  get hp() { return this.#hp }
}
