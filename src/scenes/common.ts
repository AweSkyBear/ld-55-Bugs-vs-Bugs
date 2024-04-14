import { pathEq } from 'ramda'
import { debugWarn, setGlobalVar } from '~/common/debug'
import { SCENE_KEY } from '~/common/scene'
import { getConsistentRefreshRate } from '~/common/screen'
import { Scene } from '~/common/types'
import { pipelineFactory, Pipelines } from '~/fx/pipelines/pipelines'

export const getGameCanvas = () => document.querySelector<HTMLElement>('#game canvas')

export const getGameScene = (scene: Scene) => scene.scene.get(SCENE_KEY.GAME_SCENE)
export const getForegroundScene = (scene: Scene) => scene.scene.get(SCENE_KEY.FOREGROUND_SCENE)
export const getScene = <T extends Scene>(scene: Scene, key: string) => scene.scene.get(key) as T

export const findSceneByKey = (game: Phaser.Game, key: string) =>
  game.scene.scenes.find(pathEq(['scene', 'key'], key))
setGlobalVar(findSceneByKey)

export const startScene = (game: Phaser.Game, sceneKey: keyof typeof SCENE_KEY) => {
  const targetScene = game.scene.scenes.find(pathEq(['scene', 'key'], sceneKey))
  targetScene.scene.start()

  return targetScene
}

export const registerPipelines = (scene: Scene) => {
  if (scene.renderer.type !== Phaser.WEBGL) {
    debugWarn('Not a WEBGL renderer')
    return
  }

  // pipelineFactory(scene, Pipelines.basePost, true)

  // pipelineFactory(scene, Pipelines.grayPost, true)
  pipelineFactory(scene, Pipelines.textRecolor, false, { timeFactor: 5 })
  // pipelineFactory(scene, Pipelines.simpleBlur, false, { blur: 0.001 })
  // pipelineFactory(scene, Pipelines.gaussianBlur, false, {})

  // pipelineFactory(scene, Pipelines.gaussianBlurPost, true, {})

  // pipelineFactory(scene, Pipelines.distortionPost, true, {
  //   applyHueRotation: false,

  //   distortFactor1: 0.5,
  //   sinFactor1: 5,
  //   sinTimeFactor1: 0.1,
  //   distortFactor2: 0.2,
  //   sinFactor2: 32,
  //   sinTimeFactor2: 0.01,
  // })
  // pipelineFactory(scene, Pipelines.cosmicGlow, true)
  // pipelineFactory(scene, Pipelines.distortion2Post, true)
  // pipelineFactory(scene, Pipelines.galaxyPost, true)
  // pipelineFactory(scene, Pipelines.smokeGreenishPost, true)
  // pipelineFactory(scene, Pipelines.textRecolorPost, true)
  // // pipelineFactory(scene, Pipelines.bend, false, { bendFactor: 1 })
  // // TODO: presets based on uBendFactor: 0.1
  // /*
  //       def: { uBendFactor: 0.3, uSpeed: 0.4, timeFactor: 3 })
  //       0.1  slight lean
  //       0.1 + spd 4.4  jiggly jiggle
  //       0.3 +
  //       5  ultra bend
  //     */
  // pipelineFactory(scene, Pipelines.bendPost, true, { uBendFactor: 0.1, uSpeed: 4.4, timeFactor: 3 })
  // /** */
  // pipelineFactory(scene, Pipelines.hueRotatePost, true, { uSpeed: 1 })
  // pipelineFactory(scene, Pipelines.hueRotate, true, { uSpeed: 1 })
}
