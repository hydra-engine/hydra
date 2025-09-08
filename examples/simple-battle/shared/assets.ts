import { AssetSource } from '@hydraengine/shared'
import heroAtlas from '../assets/spritesheets/hero-atlas.json'
import orcAtlas from '../assets/spritesheets/orc-atlas.json'
import potionAtlas from '../assets/spritesheets/potion-atlas.json'

export enum AssetId {
  SPRITE_HERO,
  SPRITE_ORC,
  SPRITE_POTION,
  FONT_WHITE_PEABERRY,
  BGM_BATTLE,
  SFX_HERO_HIT_1,
  SFX_HERO_HIT_2,
  SFX_HERO_HIT_3,
  SFX_HERO_MISS_1,
  SFX_HERO_MISS_2,
  SFX_HERO_MISS_3,
  SFX_HERO_HEAL,
  SFX_HERO_DIE,
  SFX_ORC_HIT_1,
  SFX_ORC_HIT_2,
  SFX_ORC_HIT_3,
  SFX_ORC_MISS_1,
  SFX_ORC_MISS_2,
  SFX_ORC_MISS_3,
  SFX_ORC_DIE,
}

export const assetSources: Record<number, AssetSource> = {
  [AssetId.SPRITE_HERO]: { src: 'assets/spritesheets/hero.png', atlas: heroAtlas },
  [AssetId.SPRITE_ORC]: { src: 'assets/spritesheets/orc.png', atlas: orcAtlas },
  [AssetId.SPRITE_POTION]: { src: 'assets/spritesheets/potion.png', atlas: potionAtlas },
  [AssetId.FONT_WHITE_PEABERRY]: { fnt: 'assets/bitmap-fonts/white-peaberry.fnt', src: 'assets/bitmap-fonts/white-peaberry.png' },
  [AssetId.BGM_BATTLE]: 'assets/bgm/battle.mp3',
  [AssetId.SFX_HERO_HIT_1]: 'assets/sfx/hero/hit/hit1.wav',
  [AssetId.SFX_HERO_HIT_2]: 'assets/sfx/hero/hit/hit2.wav',
  [AssetId.SFX_HERO_HIT_3]: 'assets/sfx/hero/hit/hit3.wav',
  [AssetId.SFX_HERO_MISS_1]: 'assets/sfx/hero/miss/miss1.wav',
  [AssetId.SFX_HERO_MISS_2]: 'assets/sfx/hero/miss/miss2.wav',
  [AssetId.SFX_HERO_MISS_3]: 'assets/sfx/hero/miss/miss3.wav',
  [AssetId.SFX_HERO_HEAL]: 'assets/sfx/hero/heal/heal.wav',
  [AssetId.SFX_HERO_DIE]: 'assets/sfx/hero/die/die.wav',
  [AssetId.SFX_ORC_HIT_1]: 'assets/sfx/orc/hit/hit1.wav',
  [AssetId.SFX_ORC_HIT_2]: 'assets/sfx/orc/hit/hit2.wav',
  [AssetId.SFX_ORC_HIT_3]: 'assets/sfx/orc/hit/hit3.wav',
  [AssetId.SFX_ORC_MISS_1]: 'assets/sfx/orc/miss/miss1.wav',
  [AssetId.SFX_ORC_MISS_2]: 'assets/sfx/orc/miss/miss2.wav',
  [AssetId.SFX_ORC_MISS_3]: 'assets/sfx/orc/miss/miss3.wav',
  [AssetId.SFX_ORC_DIE]: 'assets/sfx/orc/die/die.wav',
}
