import { checkCollision, IntervalNode, musicPlayer, PhysicsWorld } from '@hydraengine/logic-worker-lib'
import { AssetId } from '../shared/assets'
import { WorldId } from '../shared/worlds'
import { Hero } from './objects/hero'
import { Orc } from './objects/orc'
import { Potion } from './objects/potion'

const SCORE_PER_ORC = 100

export class Stage extends PhysicsWorld {
  #hero = new Hero();
  #orcs: Set<Orc> = new Set();
  #potions: Set<Potion> = new Set();

  #score = 0
  #isGameOver = false

  #spawnOrcInterval: IntervalNode
  #spawnPotionInterval: IntervalNode

  constructor() {
    super({ world: WorldId.Stage })
    musicPlayer.play(AssetId.BGM_BATTLE)

    this.add(this.#hero)
    this.add(this.#spawnOrcInterval = new IntervalNode(1, () => this.#spawnOrc()))
    this.add(this.#spawnPotionInterval = new IntervalNode(3, () => this.#spawnPotion()))

    //for (let i = 0; i < 1000; i++) {
    //  this.#spawnOrc()
    //}

    this.#hero.on('hit', (damage) => {
      for (const o of this.#orcs) {
        if (checkCollision(this.#hero.hitbox, this.#hero.worldTransform, o.hurtbox, o.worldTransform)) {
          o.takeDamage(damage)
        }
      }
    })

    this.#hero.on('dead', () => {
      this.#gameOver()
    })
  }

  #gameOver() {
    this.#isGameOver = true
    this.#spawnOrcInterval.remove()
    this.#spawnPotionInterval.remove()
    for (const o of this.#orcs) {
      o.stop()
    }
  }

  #spawnOrc() {
    const o = new Orc()
    o.x = Math.random() * 800 - 400
    o.y = Math.random() * 600 - 300
    o.on('hit', (damage) => {
      if (checkCollision(this.#hero.hurtbox, this.#hero.worldTransform, o.hitbox, o.worldTransform)) {
        this.#hero.takeDamage(damage)
      }
    })
    this.add(o)
    this.#orcs.add(o)
    o.on('dead', () => {
      this.#orcs.delete(o)
      this.#score += SCORE_PER_ORC
    })
  }

  #spawnPotion() {
    const p = new Potion()
    p.x = Math.random() * 800 - 400
    p.y = Math.random() * 600 - 300
    this.add(p)
    this.#potions.add(p)
    p.on('remove', () => this.#potions.delete(p))
  }

  override update(dt: number) {
    super.update(dt)
    if (this.#isGameOver) return

    const h = this.#hero
    if (h.dead) return

    for (const o of this.#orcs) {
      if (checkCollision(h.hurtbox, h.worldTransform, o.hitbox, o.worldTransform)) {
        o.attack()
      } else {
        o.moveTo(this.#hero.x, this.#hero.y)
      }
    }

    for (const p of this.#potions) {
      if (checkCollision(h.hitbox, h.worldTransform, p.triggerCollider, p.worldTransform)) {
        h.heal(p.healAmount)
        p.remove()
      }
    }
  }
}
