import {
  addObsDisp,
  createThrottledDispatch,
  dispatchDeferredEvent,
  dispatchEvent,
  obsDispEvents,
} from '~/OD'
import { Easing, Image, Point, Scene, Tween } from '~/common/types'
import { sceneEvents } from '~/events/sceneEvents'
import { TEXTURES_MAP } from '~/textures/textures'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { gameEvents } from '~/events/gameEvents'
import { createImage } from '~/common/image'
import { getObjPos, noop, payloadProp, payloadPropOr } from '~/common/func'
import { IMatterObj, MatterObjActions } from '~/common/matter'
import { getDistanceToClosestObjFrom } from '~/common/distance'
import { getCrate } from './global/CrateSingleton'
import { debugLog, exposeToWindow } from '~/common/debug'
import { isInGame } from './global/GameStateSingleton'
import { getCamScrollPos, mainCam } from '~/common/camera'
import throttle from '~/common/throttle'

// const dispatchGameWon = createThrottledDispatch({ name: 'GAME_WON' }, { throttleMs: 1000 })
const dispatchCreateGameLostToast = (reason: string) =>
  throttle(1000, () =>
    dispatchDeferredEvent('TOAST_CREATE', { payload: { text: `Level Fail! ${reason}` } })
  )

const dispatchCreateToastUnderwater = dispatchCreateGameLostToast('Crate is underwater.')
const dispatchCreateToastStopped = dispatchCreateGameLostToast('Could not reach flag.')

let dispatchGameLost = throttle(1000, () => dispatchEvent(gameEvents.GAME_REQUEST_RESTART))
let dispatchGameLost5000 = throttle(5000, () => dispatchEvent(gameEvents.GAME_REQUEST_RESTART))

const dispatchGameLostDelayed = (state) =>
  setTimeout(() => {
    dispatchGameLost()
  }, 2000)

// TODO:LD:add this obs
export const createDetectGameLose = (config?: { pos: Point }) => {
  const scene = ObservableScenes.game

  const state = {
    crateAlreadyStopped: false,
    crateStoppedTime: -1,
    gameLost: false,
    dispatchGameLost: dispatchGameLost5000,
  }

  const crateIsBelowWater = () => {
    return getCrate().y > 6100
  }
  const crateIsStopped = () => {
    return getCrate().body.velocity.x === 0 && getCrate().body.velocity.y === 0
  }

  return addObsDisp({
    [obsDispEvents.OBS_CREATE]: ({ payload: {} }) => {
      // todo? child observers?
    },
    [gameEvents.GAME_START]: () => {
      state.crateAlreadyStopped = false
      state.gameLost = false
      state.dispatchGameLost = dispatchGameLost5000
    },
    ['CRATE_STOPPED']: () => {
      if (state.crateAlreadyStopped) return
      state.crateAlreadyStopped = true

      dispatchCreateToastStopped()
      setTimeout(() => state.dispatchGameLost(), 2000)
    },
    [sceneEvents.UPDATE]: () => {
      if (state.gameLost) return
      if (!isInGame()) return
      if (!MatterObjActions.isSafe(getCrate())) return

      if (crateIsBelowWater()) {
        state.gameLost = true
        mainCam(ObservableScenes.game).stopFollow()
        dispatchCreateToastUnderwater()
        setTimeout(() => state.dispatchGameLost(), 2000)
      }
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      // GlobalObservers.removeMultipleObs(observers)
      // _state.keySpace?.destroy()
      // _state.keySpace = null
    },
  })
}
