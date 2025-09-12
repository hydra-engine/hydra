import { AnimatedSpriteNode, DelayNode, PhysicsObject, PhysicsObjectOptions, RectangleCollider, RectangleNode } from '@hydraengine/logic-worker-lib'
import { debugMode, RectangleRigidbody } from '@hydraengine/shared'
import { EventMap } from '@webtaku/event-emitter'
import { bodyDescriptors } from '../../shared/bodies'
import { Layer } from '../../shared/layers'
import { ShapeId } from '../../shared/shapes'
import { DamageText } from '../hud/damage-text'
import { HealText } from '../hud/heal-text'
import { HpBar } from '../hud/hp-bar'

export type CharacterOptions = {
  maxHp: number
  hp: number
  body: number
  hitbox: RectangleCollider
  hurtbox: RectangleCollider
} & PhysicsObjectOptions

export abstract class Character<E extends EventMap = {}> extends PhysicsObject<E & {
  changeHp: (damage: number) => void
  dead: () => void
}> {
  maxHp: number
  hp: number
  dead = false

  hitbox: RectangleCollider
  hurtbox: RectangleCollider

  #hpBar: HpBar
  protected _sprite?: AnimatedSpriteNode
  #hitboxDebugNode?: RectangleNode
  #tintDelay?: DelayNode

  constructor(options: CharacterOptions) {
    super({ ...options, useYSort: true })
    this.maxHp = options.maxHp
    this.hp = options.hp
    this.hitbox = options.hitbox
    this.hurtbox = options.hurtbox

    this.#hpBar = new HpBar({ y: -30, maxHp: options.maxHp, hp: options.hp, layer: Layer.HUD })
    this.add(this.#hpBar)

    if (debugMode) {
      const rigidbody = bodyDescriptors[options.body].rigidbody as RectangleRigidbody
      this.add(new RectangleNode({ shape: ShapeId.DEBUG_CHAR_BODY, ...rigidbody, alpha: 0.5, layer: Layer.HUD }))
      this.#hitboxDebugNode = new RectangleNode({ shape: ShapeId.DEBUG_CHAR_HITBOX, ...this.hitbox, alpha: 0.5, layer: Layer.HUD })
      this.add(this.#hitboxDebugNode)
      this.add(new RectangleNode({ shape: ShapeId.DEBUG_CHAR_HURTBOX, ...this.hurtbox, alpha: 0.5, layer: Layer.HUD }))
    }
  }

  set hitboxX(x: number) {
    this.hitbox.x = x
    if (this.#hitboxDebugNode) this.#hitboxDebugNode.x = x
  }

  takeDamage(damage: number) {
    if (this.dead) return

    this.hp -= damage
    this.#hpBar.hp = this.hp

    if (this._sprite) {
      this._sprite.tint = 0xff0000
      this.#tintDelay?.remove()
      this.#tintDelay = new DelayNode(0.1, () => this._sprite!.tint = 0xffffff)
      this.add(this.#tintDelay)
    }
    (this as any).emit('changeHp', damage)

    this.add(new DamageText({ y: -20, damage, layer: Layer.HUD }))

    if (this.hp <= 0) {
      this.dead = true
      this.onDie();
      (this as any).emit('dead')
    }
  }

  heal(amount: number) {
    if (this.dead) return

    this.hp = Math.min(this.maxHp, this.hp + amount)
    this.#hpBar.hp = this.hp

    if (this._sprite) {
      this._sprite.tint = 0x00ff00
      this.#tintDelay?.remove()
      this.#tintDelay = new DelayNode(0.1, () => this._sprite!.tint = 0xffffff)
      this.add(this.#tintDelay)
    }
    (this as any).emit('changeHp', amount)

    this.add(new HealText({ y: -20, hp: amount, layer: Layer.HUD }))
  }

  protected abstract onDie(): void
}
