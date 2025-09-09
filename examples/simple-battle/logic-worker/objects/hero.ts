import { AnimatedSpriteNode, ColliderType, DelayNode, GameObjectOptions, sfxPlayer } from '@hydraengine/logic-worker-lib'
import { NONE } from '@hydraengine/shared'
import { AnimationState } from '../../shared/animations'
import { AssetId } from '../../shared/assets'
import { BodyId } from '../../shared/bodies'
import { HERO_MAX_HP } from '../../shared/constants'
import { ShapeId } from '../../shared/shapes'
import { Character } from './character'

const HERO_MOVE_SPEED = 200 as const
const HERO_HITBOX_X = 24 as const
const HERO_ATTACK_DAMAGE = 60 as const

export class Hero extends Character<{
  hit: (damage: number) => void
  dead: () => void
}> {
  protected _sprite: AnimatedSpriteNode

  #cachedVelX = 0
  #cachedVelY = 0
  #prevX = this.x
  #attacking = false

  constructor(options?: GameObjectOptions) {
    super({
      ...options,
      maxHp: HERO_MAX_HP,
      hp: HERO_MAX_HP,
      body: BodyId.HERO_BODY,
      hitbox: { type: ColliderType.Rectangle, width: 32, height: 52, x: HERO_HITBOX_X, y: -8 },
      hurtbox: { type: ColliderType.Rectangle, width: 24, height: 40, x: 0, y: -4 },

      debugBodyShape: ShapeId.DEBUG_HERO_BODY,
      debugHitboxShape: ShapeId.DEBUG_HERO_HITBOX,
      debugHurtboxShape: ShapeId.DEBUG_HERO_HURTBOX,
    })

    this._sprite = new AnimatedSpriteNode({
      asset: AssetId.SPRITE_HERO,
      animation: AnimationState.Idle,
      scale: 2
    })
    this._sprite.on('animationend', (animation) => {
      if (animation.startsWith('attack')) {
        this.#attacking = false
        this._sprite.animation = AnimationState.Idle
      } else if (animation === 'die') {
        this.emit('dead')
      }
    })
    this.add(this._sprite)
  }

  move(radian: number, distance: number) {
    if (this.dead) return
    this.#cachedVelX = Math.cos(radian) * distance * HERO_MOVE_SPEED
    this.#cachedVelY = Math.sin(radian) * distance * HERO_MOVE_SPEED
  }

  stop() {
    this.#cachedVelX = 0
    this.#cachedVelY = 0
  }

  attack() {
    if (this.dead || this.#attacking) return
    this.#attacking = true

    this._sprite.animation = Math.floor(Math.random() * 2) ? AnimationState.Attack1 : AnimationState.Attack2

    this.add(new DelayNode(0.3, () => this.emit('hit', HERO_ATTACK_DAMAGE)))

    sfxPlayer.playRandom(AssetId.SFX_HERO_MISS_1, AssetId.SFX_HERO_MISS_2, AssetId.SFX_HERO_MISS_3)
  }

  override update(dt: number) {
    super.update(dt)

    this.x += this.#cachedVelX * dt
    this.y += this.#cachedVelY * dt

    if (this._sprite && this.x !== this.#prevX) {
      const scale = Math.abs(this._sprite.scaleX)
      this._sprite.scaleX = this.x > this.#prevX ? scale : -scale
      this.hitboxX = this.x > this.#prevX ? HERO_HITBOX_X : -HERO_HITBOX_X
    }
    this.#prevX = this.x
  }

  override takeDamage(damage: number) {
    super.takeDamage(damage)
    sfxPlayer.playRandom(AssetId.SFX_HERO_HIT_1, AssetId.SFX_HERO_HIT_2, AssetId.SFX_HERO_HIT_3)
  }

  override heal(amount: number) {
    super.heal(amount)
    sfxPlayer.play(AssetId.SFX_HERO_HEAL)
  }

  protected override onDie() {
    this._sprite.animation = AnimationState.Die
    this.#cachedVelX = 0
    this.#cachedVelY = 0
    this.body = NONE

    sfxPlayer.play(AssetId.SFX_HERO_DIE)
  }
}
