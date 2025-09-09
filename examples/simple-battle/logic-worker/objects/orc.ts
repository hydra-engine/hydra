import { AnimatedSpriteNode, ColliderType, DelayNode, GameObjectOptions, sfxPlayer } from '@hydraengine/logic-worker-lib'
import { NONE } from '@hydraengine/shared'
import { AnimationState } from '../../shared/animations'
import { AssetId } from '../../shared/assets'
import { BodyId } from '../../shared/bodies'
import { Character } from './character'

const ORC_MOVE_VELOCITY = 3 as const
const ORC_HITBOX_X = 24 as const
const ORC_ATTACK_DAMAGE = 15 as const

export class Orc extends Character<{
  hit: (damage: number) => void
  dead: () => void
}> {
  protected _sprite: AnimatedSpriteNode

  #cachedVelX = 0
  #cachedVelY = 0
  #attacking = false

  constructor(options?: GameObjectOptions) {
    super({
      ...options,
      maxHp: 100,
      hp: 100,
      body: BodyId.ORC_BODY,
      hitbox: { type: ColliderType.Rectangle, width: 32, height: 52, x: ORC_HITBOX_X, y: -8 },
      hurtbox: { type: ColliderType.Rectangle, width: 24, height: 32, x: 0, y: 0 },
    })

    this._sprite = new AnimatedSpriteNode({
      asset: AssetId.SPRITE_ORC,
      animation: AnimationState.Idle,
      scale: 2
    })

    this.add(this._sprite)
  }

  moveTo(x: number, y: number) {
    if (this.dead) return

    const dx = x - this.x
    const dy = y - this.y
    const radian = Math.atan2(dy, dx)
    this.#cachedVelX = Math.cos(radian) * ORC_MOVE_VELOCITY
    this.#cachedVelY = Math.sin(radian) * ORC_MOVE_VELOCITY

    const scale = Math.abs(this._sprite.scaleX)
    this._sprite.scaleX = dx > 0 ? scale : -scale
    this.hitboxX = dx > 0 ? ORC_HITBOX_X : -ORC_HITBOX_X
  }

  stop() {
    this.#cachedVelX = 0
    this.#cachedVelY = 0
  }

  attack() {
    if (this.dead || this.#attacking) return
    this.#attacking = true

    this.#cachedVelX = 0
    this.#cachedVelY = 0

    this._sprite.animation = Math.floor(Math.random() * 2) ? AnimationState.Attack1 : AnimationState.Attack2

    this.add(new DelayNode(0.3, () => this.emit('hit', ORC_ATTACK_DAMAGE)))

    sfxPlayer.playRandom(
      AssetId.SFX_ORC_MISS_1,
      AssetId.SFX_ORC_MISS_2,
      AssetId.SFX_ORC_MISS_3
    )

    this.add(new DelayNode(0.5, () => {
      this.#attacking = false
      this._sprite.animation = AnimationState.Idle
    }))
  }

  override update(dt: number) {
    super.update(dt)
    this.velocityX = this.#cachedVelX
    this.velocityY = this.#cachedVelY
  }

  override takeDamage(damage: number) {
    super.takeDamage(damage)
    sfxPlayer.playRandom(
      AssetId.SFX_ORC_HIT_1,
      AssetId.SFX_ORC_HIT_2,
      AssetId.SFX_ORC_HIT_3
    )
  }

  protected override onDie() {
    this._sprite.animation = AnimationState.Die
    this.#cachedVelX = 0
    this.#cachedVelY = 0
    this.body = NONE

    sfxPlayer.play(AssetId.SFX_ORC_DIE)

    this.add(new DelayNode(0.5, () => this.emit('dead')))
  }
}
