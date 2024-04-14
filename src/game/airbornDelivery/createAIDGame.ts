import { obsDispEvents } from 'obs-disp'
import { addObsDisp, dispatchDeferredEvent } from '~/OD'
import { gameEvents } from '~/events/gameEvents'
import { setGameState } from './global/GameStateSingleton'

// only initial entry point actions dispatched!
export const createAIDGame = () => {
  return addObsDisp({
    [obsDispEvents.OBS_CREATE]: ({ payload: { obs } }) => {
      // TODO:LD later - sth else - for now - direct start
      setGameState('in-game')
      dispatchDeferredEvent(gameEvents.LEVEL_SET_LEVEL, { payload: { index: 0 } })
      setTimeout(() => dispatchDeferredEvent(gameEvents.SCREEN_GO_TO_BEFORE_GAME), 100)

      // dispatchDeferredEvent('all', gameEvents.GAME_START) // FOR TESTING

      //// INITIAL CAM DEBUGGING
      // DEBuG DEBug ObservableScenes.game.cameras.main.zoom = 0.1
      // ObservableScenes.game.cameras.main.zoom = 0.1

      // DEBUG:
      // scene.matter.add.mouseSpring({ stiffness: 1 })
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      // GlobalObservers.removeMultipleObs(observers)
      // _state.keySpace?.destroy()
      // _state.keySpace = null
    },
  })
}
