import { Func, Point } from '~/common/types'
import {
  constructEvents,
  createThrottledDispatch,
  dispatchEvent,
  IEvent,
  obsDispCreator,
  obsDispEvents,
  TEventTarget,
} from '../OD'
import { TEventDispatchOptions } from 'obs-disp/dist/obs-disp'
import { exposeToWindow } from '~/common/debug'
import { events } from './events'
import { sceneEvents } from '~/events/sceneEvents'
import { Global } from './global/global'

export const createTimer = obsDispCreator(() => {
  const state = {
    running: false,
    timerS: 0,
    timerMin: 6,
  }

  return {
    [obsDispEvents.OBS_CREATE]: () => {
      //
    },
    [events.LD_GAME_START]: () => {
      state.running = true
      state.timerS = 0
      state.timerMin = 0
      Global.timerS = 0
      Global.timerMin = 0
    },
    [events.LD_GAME_ENDED]: () => {
      state.running = false
    },
    [sceneEvents.UPDATE]: () => {
      if (state.running && Global.isEvery60thFrame) {
        state.timerS++
        Global.timerS = state.timerS

        const minutePassed = state.timerS !== 0 && state.timerS % 60 === 0
        const halfMinPassed = !minutePassed && state.timerS !== 0 && state.timerS % 30 === 0

        if (halfMinPassed) {
          dispatchEvent(events.LD_TIMER_HALF_MINUTE_PASS, {
            payload: { secondsTotal: state.timerS, minute: state.timerMin },
          })
        } else if (minutePassed) {
          state.timerMin++
          Global.timerMin = state.timerMin
          dispatchEvent(events.LD_TIMER_MINUTE_PASS, {
            payload: { secondsTotal: state.timerS, minute: state.timerMin },
          })
        }
      }
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      //
    },
  }
})

export const renderGameTime = () => {
  return `${Global.timerMin}:${
    Global.timerS % 60 < 10 ? '0' + (Global.timerS % 60) : Global.timerS % 60
  }`
}
