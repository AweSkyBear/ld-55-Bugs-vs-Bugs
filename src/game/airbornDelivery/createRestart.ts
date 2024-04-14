import { addObsDisp, dispatchDeferredEvent, dispatchEvent, obsDispEvents } from '~/OD'
import { sceneEvents } from '~/events/sceneEvents'
import { inputEvents } from '~/events/inputEvents'
import { payloadProp } from '~/OD'
import { gameEvents } from '~/events/gameEvents'
import { isInGame } from './global/GameStateSingleton'

export const createRestart = () => {
  const state = {
    keyRestart: false,
    canRestartAgain: true,
  }

  const restart = () => {
    if (!state.canRestartAgain) return

    ///
    state.canRestartAgain = false
    setTimeout(() => (state.canRestartAgain = true), 300)
    ///

    // MANUAL
    dispatchEvent(gameEvents.GAME_RESTART)
    dispatchDeferredEvent(gameEvents.GAME_START)
  }

  return addObsDisp({
    [obsDispEvents.OBS_CREATE]: ({ payload: {} }) => {
      //
    },
    [inputEvents.INPUT_UPDATE_STATE]: (ev) => {
      const keys = payloadProp<Record<string, boolean>>('keys')(ev)
      state.keyRestart = keys.r
    },
    [gameEvents.GAME_REQUEST_RESTART]: restart,
    [sceneEvents.UPDATE]: () => {
      if (state.keyRestart && isInGame()) {
        if (!state.canRestartAgain) return

        restart()
      }
    },
    [obsDispEvents.OBS_REMOVE]: () => {},
  })
}
