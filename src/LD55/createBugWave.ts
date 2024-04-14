import { Func, Point } from '~/common/types'
import {
  constructEvents,
  createThrottledDispatch,
  dispatchEvent,
  getObserversByName,
  IEvent,
  IObserver,
  obsDispCreator,
  obsDispEvents,
  removeObs,
  TEventTarget,
} from '../OD'
import { TEventDispatchOptions } from 'obs-disp/dist/obs-disp'
import { exposeToWindow } from '~/common/debug'
import { repeat } from 'ramda'
import { createBug } from './createBug'
import { setAdvancedTimeout } from '~/common/tween'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { events } from './events'
import { IBugWaveConfig } from './interfaces/IBugWaveConfig'
import { getTotalEnemyCount } from './global/global'
import { ObsDispCreate } from 'obs-disp'

export const createBugWave = obsDispCreator<{
  pos: Point
  bugWaveConfig: IBugWaveConfig
}>((props) => {
  const c = props.bugWaveConfig
  const state = {
    obs: null as IObserver,
    newGenerationBugs: [] as IObserver[],
  }

  return {
    [obsDispEvents.OBS_CREATE]: ObsDispCreate.useObs(async (obs) => {
      state.obs = obs
      // PERF FIX
      if (getTotalEnemyCount() > 100) return

      const bugs = repeat(null, props.bugWaveConfig.initialCount).map((_, ind) => {
        return createBugForWave(props.pos, c)
      })

      const getExistingBugs = () => getObserversByName('bug')

      if (c.reprodStartAfterS) {
        await triggerDivision(c, bugs, () => {
          removeObs(obs) // clean itself after this
        })
        // await triggerDivision(c, getExistingBugs())
        // await triggerDivision(c, getExistingBugs())
        // await triggerDivision(c, getExistingBugs())
        // await triggerDivision(c, getExistingBugs())
        // setAdvancedTimeout({
        //   scene: ObservableScenes.game,
        //   duration: c.reprodStartAfterS * 1000,
        // }).then((tween) => {
        //   // pick % count of bugs
        //   const countToReprod = parseInt((c.initialCount * (c.populReproductionPct / 100)) as any)
        //   const reprodBugs = bugs.slice(0, countToReprod)
        //   dispatchEvent(events.LD_REPROD_ME, { target: reprodBugs, payload: { bugWaveConfig: c } })
        // })
      }

      // TODO:CLEAN remove immediately after?
    }),
    [obsDispEvents.OBS_REMOVE]: () => {
      // <nothing here> ?
      state.obs = null
    },
  }
})

export const createBugForWave = (pos: Point, c: IBugWaveConfig) => {
  const bug = createBug({ pos, type: c.bugSize as any })

  return bug
}

const triggerDivision = (
  c: IBugWaveConfig,
  bugsToReprod: IObserver[],
  afterDone?: Func<IObserver[], void>
) => {
  return setAdvancedTimeout({
    scene: ObservableScenes.game,
    duration: c.reprodStartAfterS * 1000,
  })
    .then((tween) => {
      // pick % count of bugs
      const countToReprod = parseInt((bugsToReprod.length * (c.populReproductionPct / 100)) as any)
      const reprodBugs = bugsToReprod.slice(0, countToReprod)
      dispatchEvent(events.LD_REPROD_ME, { target: reprodBugs, payload: { bugWaveConfig: c } })

      return reprodBugs
    })
    .then((bugs) => {
      afterDone?.(bugs)
      return bugs
    })
}
