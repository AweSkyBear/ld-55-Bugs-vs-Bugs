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
import { createBug } from './createBug'
import { basedOn } from '~/common/func'
import { Global } from './global/global'

export const controlPoints = obsDispCreator(() => {
  const state = {
    points: 0,
  }

  return {
    [obsDispEvents.OBS_CREATE]: () => {
      //
    },
    [events.LD_ENEMY_BUG_KILLED]: (ev) => {
      const { bugProps } = ev.payload // unused

      const pointsForKill = getPointsForKill(bugProps)
      state.points++

      dispatchEvent(events.LD_POINTS_CHANGED, {
        payload: { points: state.points, pointsDelta: pointsForKill },
      })

      Global.totalKills++
    },
  }
})

const getPointsForKill = (props: Parameters<typeof createBug>[0]) => {
  return basedOn({
    small: () => 1,
    big: () => 5,
    large: () => 10,
  })(props.type) as any as number
}
