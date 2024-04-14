import { addObsDisp, createThrottledDispatch, dispatchEvent, obsDispEvents } from '~/OD'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { sceneEvents } from '~/events/sceneEvents'
import { inputEvents } from '~/events/inputEvents'
import { payloadProp } from '~/OD'
import { gameEvents } from '~/events/gameEvents'
import { mainCam } from '~/common/camera'
import throttle from '~/common/throttle'
import { isInGame } from '~/game/airbornDelivery/global/GameStateSingleton'

const dispatchGamePause = throttle(100, () => dispatchEvent(gameEvents.GAME_PAUSE))

const dispatchGameResume = throttle(100, () => dispatchEvent(gameEvents.GAME_RESUME))

export const controlPause = () => {
  const state = {
    keyPause: false,
    wasd: [false, false, false, false] as [boolean, boolean, boolean, boolean],
    canChangePausedState: true,
    isPaused: false,
  }

  return addObsDisp({
    [obsDispEvents.OBS_CREATE]: ({ payload: {} }) => {
      //
    },
    [inputEvents.INPUT_UPDATE_STATE]: (ev) => {
      const keys = payloadProp<Record<string, boolean>>('keys')(ev)
      state.keyPause = keys.p

      state.wasd = [keys.w, keys.a, keys.s, keys.d]
    },
    [sceneEvents.UPDATE]: () => {
      if (!isInGame()) return

      if (state.keyPause && isInGame()) {
        if (!state.canChangePausedState) return

        ///
        state.canChangePausedState = false
        setTimeout(() => (state.canChangePausedState = true), 300)
        ///

        state.isPaused ? dispatchGameResume() : dispatchGamePause()
      }

      if (!state.isPaused) return
    },
    [gameEvents.GAME_PAUSE]: () => {
      if (state.isPaused) return

      state.isPaused = true

      // handle general pausing logic
      ObservableScenes.game.matter.world.pause()
      mainCam(ObservableScenes.game).stopFollow()
      // TODO:FEAT also shold pause any tweens
      // ObservableScenes.game.scene.pause()
    },
    [gameEvents.GAME_RESUME]: () => {
      if (!state.isPaused) return

      state.isPaused = false

      // handle general un-pausing logic
      ObservableScenes.game.matter.world.resume()
      // ObservableScenes.game.scene.resume()
    },
    [obsDispEvents.OBS_REMOVE]: () => {},
  })
}
