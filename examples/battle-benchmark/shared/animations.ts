export enum AnimationState {
  Idle,
  Attack1,
  Attack2,
  Die,
  Animation,
}

export const animationNames = {
  [AnimationState.Idle]: 'idle',
  [AnimationState.Attack1]: 'attack1',
  [AnimationState.Attack2]: 'attack2',
  [AnimationState.Die]: 'die',
  [AnimationState.Animation]: 'animation',
}
