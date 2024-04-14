import { addObsDisp, dispatchEvent, obsDispEvents } from '~/OD'
import { sceneEvents } from '~/events/sceneEvents'
import { inputEvents } from '~/events/inputEvents'
import { payloadProp } from '~/OD'
import { isInGame } from './global/GameStateSingleton'

export const createExit = () => {
  const state = {
    keyExit: false,
    canExitAgain: true,
  }

  return addObsDisp({
    [obsDispEvents.OBS_CREATE]: ({ payload: {} }) => {
      //
    },
    [inputEvents.INPUT_UPDATE_STATE]: (ev) => {
      const keys = payloadProp<Record<string, boolean>>('keys')(ev)
      state.keyExit = keys.x
    },
    [sceneEvents.UPDATE]: () => {
      if (state.keyExit && isInGame()) {
        if (!state.canExitAgain) return

        ///
        state.canExitAgain = false
        setTimeout(() => (state.canExitAgain = true), 300)
        ///

        // MANUAL
        dispatchEvent('SCREEN_GO_TO_BEFORE_GAME')
      }
    },
    [obsDispEvents.OBS_REMOVE]: () => {},
  })
}
