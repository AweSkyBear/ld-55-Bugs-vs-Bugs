// createCrosshair

import { Func, Point, Scene } from '~/common/types'
import {
  constructEvents,
  createThrottledDispatch,
  dispatchDeferredEvent,
  dispatchEvent,
  IEvent,
  obsDispCreator,
  obsDispEvents,
  TEventTarget,
} from '../OD'
import { TEventDispatchOptions } from 'obs-disp/dist/obs-disp'
import { exposeToWindow } from '~/common/debug'
import { gameEvents } from '~/events/gameEvents'
import { inputEvents } from '~/events/inputEvents'
import { createCrosshair } from './createCrosshair'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { events } from './events'
import { getGameCanvas } from '~/common/screen'
import { defer, waitMs } from '~/common/func'
import { Global } from './global/global'

const getPointerPos = (scene: Scene) => ({
  x: scene.input.activePointer.worldX,
  y: scene.input.activePointer.worldY,
})

export const controlCrosshairCreation = obsDispCreator(() => {
  const state = {
    maxCrosshairs: 3,
    crosshairCount: 0,
  }

  return {
    [obsDispEvents.OBS_CREATE]: () => {
      //
    },
    [inputEvents.GLOBAL_POINTER_DOWN]: async (ev) => {
      if (Global.ignoreGlobalPointerDown || Global.isUnsummoning) return

      const isPrimaryBtnClicked = ev.payload.pointer.button === 0

      if (!isPrimaryBtnClicked || state.crosshairCount >= state.maxCrosshairs) {
        return
      }

      const crosshairInd = state.crosshairCount

      createCrosshair({
        pos: getPointerPos(ObservableScenes.game),
        tint: 0x00ff + crosshairInd * 30001 * 300 * Math.random(),
        ind: crosshairInd,
      })
      state.crosshairCount++

      if (state.crosshairCount === state.maxCrosshairs) {
        dispatchDeferredEvent(events.LD_CROSSHAIR_COUNT_REACHED)
      }
    },
    [events.LD_PLAYER_SUMMON_ENDED]: () => {
      state.crosshairCount = 0
    },
  }
})
