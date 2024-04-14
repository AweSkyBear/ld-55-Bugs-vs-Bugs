import { Point } from '~/common/types'
import { addObsDisp, dispatchEvent, obsDispEvents } from '~/OD'
import { gameEvents } from '~/events/gameEvents'
import { getGameState, setGameState } from './global/GameStateSingleton'

export const createScreenSwitcher = (config?: { pos: Point }) => {
  const state = {
    screen: getGameState(),
  }

  return addObsDisp({
    [obsDispEvents.OBS_CREATE]: ({ payload: {} }) => {},
    [gameEvents.GAME_START]: () => {
      dispatchEvent('SCREEN_GO_TO_GAME')
      setGameState('in-game')
      state.screen = getGameState()
      // TODO:LD - in createScreenBeforeGame()    hide the controls
    },
    [gameEvents.GAME_WON]: () => {
      setTimeout(() => dispatchEvent('SCREEN_GO_TO_BEFORE_GAME'), 3000)
    },
    [gameEvents.SCREEN_GO_TO_BEFORE_GAME]: () => {
      setGameState('before-game')
      state.screen = getGameState()
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      // GlobalObservers.removeMultipleObs(observers)
      // _state.keySpace?.destroy()
      // _state.keySpace = null
    },
  })
}
