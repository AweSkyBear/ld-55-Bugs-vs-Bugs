import { Point } from '~/common/types'
import { addObsDisp, obsDispEvents } from '~/OD'
import { sceneEvents } from '~/events/sceneEvents'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { gameEvents } from '~/events/gameEvents'

export const createScreenBeforeGame = (config?: { pos: Point }) => {
  const scene = ObservableScenes.game

  return addObsDisp({
    [obsDispEvents.OBS_CREATE]: ({ payload: {} }) => {
      // todo? child observers?
    },
    [gameEvents.GAME_START]: () => {
      //   state.skyBgImg = createImage({ scene, texture: TEXTURES_MAP.SKY_BACKGROUND })
      //   state.skyBgImg.scaleX = 4000
      //   state.skyBgImg.scaleY = 4
    },
    ['SCREEN_GO_TO_GAME']: () => {
      scene.scene.setVisible(true)
      // TODO:LD hide the controls
    },
    ['SCREEN_GO_TO_BEFORE_GAME']: () => {
      scene.scene.setVisible(false)
      // TODO:LD OVERLAY the game screen
      // TODO:LD controls for LEVEL selection
    },
    [sceneEvents.UPDATE]: () => {
      // if (_state.keySpace && scene.input.keyboard.checkDown(_state.keySpace, 500)) {
      //   _state.isPaused = !_state.isPaused
      //   _state.isPaused ? GameFlow.pauseGame() : GameFlow.resumeGame()
      //   debugLog('PAUSED')
      // }
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      // GlobalObservers.removeMultipleObs(observers)
      // _state.keySpace?.destroy()
      // _state.keySpace = null
    },
  })
}
