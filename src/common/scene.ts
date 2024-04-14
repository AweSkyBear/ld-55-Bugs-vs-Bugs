import { complement, curry, defaultTo, find, flip, pathEq, reverse } from 'ramda'
import { exposeToWindow, setGlobalVar, useDebugConstant } from './debug'
import { GameObject, Scene } from './types'

export type TSceneKey = keyof typeof SCENE_KEY

export const SCENE_KEY = {
  GAME_SCENE: 'GAME_SCENE',
  BOOT_SCENE: 'BOOT_SCENE',
  BACKGROUND_SCENE: 'BACKGROUND_SCENE',
  FOREGROUND_SCENE: 'FOREGROUND_SCENE',
  // STAR_GRAVITY_GAME: 'STAR_GRAVITY_GAME',
} // as Record<keyof typeof SCENE_KEY, any>

export const BOOT_SCENE_KEY = 'BootScene'

// todo: revise
export const getByKey = (scene: Scene, key: string) =>
  scene.scene.manager.getAt(scene.scene.manager.getIndex(key))

// todo: revise
export const sendToTop = (child: GameObject) =>
  child.scene && child.scene.children.bringToTop(child)
export const sendToTopInOrder = (sceneChildren: GameObject[]) =>
  // reverse(sceneChildren).
  sceneChildren.forEach((child) => child.scene.children.bringToTop(child))

export const sendToBack = (child: any) => child.scene && child.scene.children.sendToBack(child)

export const SceneChildrenActions = {
  sendToTop,
  sendToTopInOrder,
  sendToBack,
}
// export const sendABehindB = (scene: Scene, childA: any, childB) =>
//   Phaser.Utils.Array.MoveBelow(scene.children, childA, childB)

export const sendSceneToTop = (scene: Scene) => {
  scene.scene.bringToTop(scene)
}
export const sendSceneToBack = (scene: Scene) => {
  scene.scene.sendToBack(scene)
}

const TARGET_FPS = 60

export const getFPSFactor = (
  scene: Scene,
  /**
   * @power2 The magic change, in case we need Math.pow(fpsFactor, 2)
   * And this is the case when applying controls for example.. ?
   */
  config: Partial<{ targetFPS: number; power2: boolean }> = { targetFPS: TARGET_FPS, power2: false }
) => {
  return 1
  let actualFps = 1000 / scene.game.loop.delta
  // CALIBRATIONS / slight
  if (actualFps < 65 && actualFps > 55) actualFps = 60
  if (actualFps < 125 && actualFps > 115) actualFps = 120
  ///////////////////////////

  const [targetFPS, power2] = [
    defaultTo(scene.matter.world.runner.fps, config.targetFPS),
    defaultTo(false, config.power2),
  ]

  // NOTE: the MAGIC formula is THIS!
  const factor = !power2 ? targetFPS / actualFps : Math.pow(targetFPS / actualFps, 2)
  return useDebugConstant('fpsFactor', factor)
}

/**
 * @deprecated
 * @param givenFPS
 * @param config
 * @returns
 */
export const getFPSFactorGivenFps = (
  givenFPS: number,
  config: { targetFPS: number } = { targetFPS: TARGET_FPS }
) => {
  const factor = config.targetFPS / givenFPS
  return factor
}
exposeToWindow({ sendToTop, sendToBack })
