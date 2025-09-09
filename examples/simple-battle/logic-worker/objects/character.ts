import { PhysicsObject, PhysicsObjectOptions, RectangleCollider } from '@hydraengine/logic-worker-lib'
import { EventMap } from '@webtaku/event-emitter'

export type CharacterOptions = {
  maxHp: number
  hp: number
  body: number
  hitbox: RectangleCollider
  hurtbox: RectangleCollider
} & PhysicsObjectOptions

export abstract class Character<E extends EventMap = EventMap> extends PhysicsObject<E & {
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
    super({ ...options, fixedRotation: true, useYSort: true })
    this.maxHp = options.maxHp
    this.hp = options.hp
    this.hitbox = options.hitbox
    this.hurtbox = options.hurtbox

    this.#hpBar = new HpBar({ y: -30, maxHp: options.maxHp, hp: options.hp, layer: 'hud' })
    this.add(this.#hpBar)

    if (debugMode) {
      this.add(new RectangleNode({ ...options.rigidbody, stroke: 'yellow', alpha: 0.5, layer: 'hud' }))
      this.#hitboxDebugNode = new RectangleNode({ ...this.hitbox, stroke: 'red', alpha: 0.5, layer: 'hud' })
      this.add(this.#hitboxDebugNode)
      this.add(new RectangleNode({ ...this.hurtbox, stroke: 'green', alpha: 0.5, layer: 'hud' }))
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

    this.add(new DamageText({ y: -20, damage, layer: 'hud' }))

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

    this.add(new HealText({ y: -20, hp: amount, layer: 'hud' }))
  }

  protected abstract onDie(): void
}
