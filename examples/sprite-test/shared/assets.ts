import { AssetSource } from '../../../packages/render-worker-lib/src'

export enum AssetId {
  Bird,
  Fire,
}

export const assetSources: Record<number, AssetSource> = {
  [AssetId.Bird]: 'assets/bird.png',
  [AssetId.Fire]: {
    src: 'assets/fire.png',
    atlas: {
      frames: {
        fire1: { frame: { x: 0, y: 0, w: 64, h: 64 } },
        fire2: { frame: { x: 64, y: 0, w: 64, h: 64 } },
        fire3: { frame: { x: 128, y: 0, w: 64, h: 64 } },
        fire4: { frame: { x: 192, y: 0, w: 64, h: 64 } },
        fire5: { frame: { x: 256, y: 0, w: 64, h: 64 } },
      },
      meta: { scale: 1 },
      animations: {
        fire: ['fire1', 'fire2', 'fire3', 'fire4', 'fire5'],
      },
    },
  },
}
