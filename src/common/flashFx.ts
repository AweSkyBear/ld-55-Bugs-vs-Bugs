import { GameObject, Image, Scene, TweenBuilderConfig } from './types'

export const flashObj = (obj: GameObject, tweenProps?: TweenBuilderConfig) =>
  obj.scene.tweens.add({
    targets: [obj],
    alpha: { from: 1, to: 0 },
    yoyo: 1,
    duration: 60,
    ...tweenProps,
  })
