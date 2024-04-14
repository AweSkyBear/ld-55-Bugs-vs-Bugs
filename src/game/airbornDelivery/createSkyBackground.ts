import { Image, Point } from '~/common/types'
import { IObserver, addObsDisp, obsDispEvents } from '~/OD'
import { sceneEvents } from '~/events/sceneEvents'
import { TEXTURES_MAP } from '~/textures/textures'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { gameEvents } from '~/events/gameEvents'
import { createImage } from '~/common/image'
import { exposeToWindow } from '~/common/debug'
import { Plane } from './const/Plane'
import { MatterObjActions } from '~/common/matter'

/** Sky gradient + clouds image */
export const createSkyBackground = (config?: { pos: Point }) => {
  const observers: IObserver[] = []
  const scene = ObservableScenes.game

  const state = {
    cloudsBgImg: null as Image,
    skyBgGradientImg: null as Image,
  }

  return addObsDisp({
    [obsDispEvents.OBS_CREATE]: ({ payload: {} }) => {
      // todo? child observers?
    },
    [gameEvents.GAME_START]: () => {
      state.skyBgGradientImg = createImage({ scene, texture: TEXTURES_MAP.SKY_BACKGROUND })
      state.skyBgGradientImg.scaleX = 4000
      state.skyBgGradientImg.scaleY = 4

      state.cloudsBgImg = createImage({ scene, texture: TEXTURES_MAP.CLOUDS }).setPosition(
        Plane.initialPos.x,
        Plane.initialPos.y
      )
      state.cloudsBgImg.setScale(20)

      exposeToWindow({ state })
    },
    [sceneEvents.UPDATE]: () => {
      // if (_state.keySpace && scene.input.keyboard.checkDown(_state.keySpace, 500)) {
      //   _state.isPaused = !_state.isPaused
      //   _state.isPaused ? GameFlow.pauseGame() : GameFlow.resumeGame()
      //   debugLog('PAUSED')
      // }
    },
    GAME_RESTART: () => {
      MatterObjActions.destroyAll([state.cloudsBgImg, state.skyBgGradientImg])
      ;(state.cloudsBgImg = null as Image), (state.skyBgGradientImg = null as Image)
    },
    GAME_WON: () => {
      MatterObjActions.destroyAll([state.cloudsBgImg, state.skyBgGradientImg])
      ;(state.cloudsBgImg = null as Image), (state.skyBgGradientImg = null as Image)
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      // GlobalObservers.removeMultipleObs(observers)
      // _state.keySpace?.destroy()
      // _state.keySpace = null
    },
  })
}
