import { AnimatedSpriteNode, ColliderType, DelayNode, GameObjectOptions } from '@hydraengine/logic-worker-lib'
import { HERO_MAX_HP } from '../../shared/constants'
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
      rigidbody: { type: RigidbodyType.Rectangle, width: 30, height: 30 },
      hitbox: { type: ColliderType.Rectangle, width: 32, height: 52, x: HERO_HITBOX_X, y: -8 },
      hurtbox: { type: ColliderType.Rectangle, width: 24, height: 40, x: 0, y: -4 },
      isStatic: true
    })

    this._sprite = new AnimatedSpriteNode({
      src: 'assets/spritesheets/hero.png',
      atlas: heroAtlas,
      animation: 'idle',
      scale: 2
    })
    this._sprite.on('animationend', (animation) => {
      if (animation.startsWith('attack')) {
        this.#attacking = false
        this._sprite.animation = 'idle'
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

    this._sprite.animation = Math.floor(Math.random() * 2) ? 'attack1' : 'attack2'

    this.add(new DelayNode(0.3, () => this.emit('hit', HERO_ATTACK_DAMAGE)))

    sfxPlayer.playRandom(
      'assets/sfx/hero/miss/miss1.wav',
      'assets/sfx/hero/miss/miss2.wav',
      'assets/sfx/hero/miss/miss3.wav',
    )
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
    sfxPlayer.playRandom(
      'assets/sfx/hero/hit/hit1.wav',
      'assets/sfx/hero/hit/hit2.wav',
      'assets/sfx/hero/hit/hit3.wav'
    )
  }

  override heal(amount: number) {
    super.heal(amount)
    sfxPlayer.play('assets/sfx/hero/heal/heal.wav')
  }

  protected override onDie() {
    this._sprite.animation = 'die'
    this.#cachedVelX = 0
    this.#cachedVelY = 0
    this.disableCollisions()

    sfxPlayer.play('assets/sfx/hero/die/die.wav')
  }
}
