export enum AssetId {
  Bird,
  Fire,
}

export const assetSources: Record<number, string> = {
  [AssetId.Bird]: 'assets/bird.png',
  [AssetId.Fire]: 'assets/fire.png',
}
