export const setAdvancedTimeout = ({
  scene,
  duration,
  tweenConfig,
}: {
  scene: Phaser.Scene
  duration: number
  tweenConfig?:
    | Phaser.Types.Tweens.TweenBuilderConfig
    | Phaser.Types.Tweens.TweenChainBuilderConfig
    | Phaser.Tweens.Tween
    | Phaser.Tweens.TweenChain
}) => {
  return new Promise(
    (resolve) => scene.time.delayedCall(duration, resolve)
    // {
    //     targets: [],
    //     alpha: { from: 0, to: 1 }, // arbitrary prop
    //     duration,
    //     yoyo: false,
    //     repeat: 0,
    //     ...tweenConfig,
    //     onComplete: (tween) => resolve({ tween }),
    //   })
    // )
  )
}
