import { Func, Image, Point } from '~/common/types'
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
import { createBug } from './createBug'
import { sceneEvents } from '~/events/sceneEvents'
import { createBugWave } from './createBugWave'
import { IBugWaveConfig } from './interfaces/IBugWaveConfig'
import { events } from './events'
import { Global, getTotalEnemyCount } from './global/global'
import { Arc } from 'phaser3-rex-plugins/plugins/gameobjects/shape/shapes/geoms'
import { MatterObjActions } from '~/common/matter'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { repeat } from 'ramda'
import { TEXTURES_MAP } from '~/textures/textures'
import { sendToBack } from '~/common/scene'

const LEVEL_1_WAVE: IBugWaveConfig = {
  bugSize: 'small',
  initialCount: 1,
  populReproductionPct: 0,
  reprodStartAfterS: 5,
  reprodSpawnCount: 2,
}

/** Enemy bugs */
export const controlBugCreation = obsDispCreator(
  () => {
    const state = {
      wave: 0,
      /** The arc to create bugs from */
      _creationCircles: [] as (Phaser.GameObjects.Arc | Phaser.Geom.Circle)[],
      _creationCirclesBg: [] as Image[],
    }

    return {
      [obsDispEvents.OBS_CREATE]: () => {
        // first WAVE !
        state._creationCircles = createCreationsCircles()
        state._creationCirclesBg = createCreationsCirclesBGs()

        createBugsFor(state.wave, Global.timerMin, state._creationCircles)
      },
      [events.LD_TIMER_HALF_MINUTE_PASS]: () => {
        state.wave += 1
        // X - not here, too fast!  bug creation every 30s
        // createBugsFor(state.wave, Global.timerMin, state._creationCircles)
      },
      [events.LD_TIMER_MINUTE_PASS]: (ev) => {
        const { secondsTotal, minute } = ev.payload
        state.wave = 0 // reset for each minute
        createBugsFor(state.wave, minute, state._creationCircles)
      },
      [events.LD_GAME_ENDED]: () => {
        state.wave = 0
      },
      [obsDispEvents.OBS_REMOVE]: () => {
        state._creationCircles = []
      },
    }
  },
  { id: 'control-bug-creation' }
)

const createBugsFor = (
  wave: number,
  timeMinute: number,
  circles: (Phaser.GameObjects.Arc | Phaser.Geom.Circle)[]
) => {
  // PERF FIX: and difficulty reduction!
  if (getTotalEnemyCount() > 100) return

  if (timeMinute < 1) {
    if (Global.timerS < 30) {
      const yOffset = -1000
      // just the first time - the hardcoded ones
      createBugWave({ bugWaveConfig: LEVEL_1_WAVE, pos: { x: 200, y: 200 + yOffset } })
      createBugWave({ bugWaveConfig: LEVEL_1_WAVE, pos: { x: 800, y: 200 + yOffset } })
      createBugWave({ bugWaveConfig: LEVEL_1_WAVE, pos: { x: 400, y: -200 + yOffset } })

      createBugWave({ bugWaveConfig: LEVEL_1_WAVE, pos: { x: 1200, y: 200 + yOffset } })
      createBugWave({ bugWaveConfig: LEVEL_1_WAVE, pos: { x: 1800, y: 200 + yOffset } })
      createBugWave({ bugWaveConfig: LEVEL_1_WAVE, pos: { x: 1400, y: -200 + yOffset } })

      createBugWave({ bugWaveConfig: LEVEL_1_WAVE, pos: { x: 1200, y: 200 + yOffset } })
      createBugWave({ bugWaveConfig: LEVEL_1_WAVE, pos: { x: 1800, y: 200 + yOffset } })
      createBugWave({ bugWaveConfig: LEVEL_1_WAVE, pos: { x: 1400, y: -200 + yOffset } })

      createBugWave({ bugWaveConfig: LEVEL_1_WAVE, pos: { x: 1200, y: 200 + yOffset * 2 } })
      createBugWave({ bugWaveConfig: LEVEL_1_WAVE, pos: { x: 1800, y: 200 + yOffset * 2 } })
      createBugWave({ bugWaveConfig: LEVEL_1_WAVE, pos: { x: 1400, y: -200 + yOffset * 2 } })
      createBugWave({ bugWaveConfig: LEVEL_1_WAVE, pos: { x: 1200, y: 200 + yOffset * 2 } })
      createBugWave({ bugWaveConfig: LEVEL_1_WAVE, pos: { x: 1800, y: 200 + yOffset * 2 } })
      createBugWave({ bugWaveConfig: LEVEL_1_WAVE, pos: { x: 1400, y: -200 + yOffset * 2 } })
    }
  } else if (timeMinute >= 1 && timeMinute < 2) {
    // for circles ! ! !
    const circleIndToCreateFrom = Global.prando.nextInt(2, 4) // circles.length - 1)
    const circle = circles[circleIndToCreateFrom] as Phaser.Geom.Circle

    const waveCount = 5

    repeat(null, waveCount).map(() => {
      const nextPos = Global.prando.nextArrayItem(circle.getPoints(20))

      createBugWave({
        bugWaveConfig: {
          bugSize: 'small',
          initialCount: 5,
          populReproductionPct: 0,
          reprodStartAfterS: 5,
          reprodSpawnCount: 2,
        },
        pos: nextPos,
      })
    })
  } else if (timeMinute >= 2 && timeMinute < 3) {
    // for circles ! ! !
    const circleIndToCreateFrom = Global.prando.nextInt(2, 2) // circles.length - 1)
    const circle = circles[circleIndToCreateFrom] as Phaser.Geom.Circle

    const waveCount = 7

    repeat(null, waveCount).map(() => {
      const nextPos = Global.prando.nextArrayItem(circle.getPoints(20))

      createBugWave({
        bugWaveConfig: {
          bugSize: 'small',
          initialCount: 5,
          populReproductionPct: 0,
          reprodStartAfterS: 5,
          reprodSpawnCount: 2,
        },
        pos: nextPos,
      })
    })
  } else if (timeMinute >= 3 && timeMinute < 4) {
    // for circles ! ! !
    const circleIndToCreateFrom = Global.prando.nextInt(4, 6) // circles.length - 1)
    const circle = circles[circleIndToCreateFrom] as Phaser.Geom.Circle

    const waveCount = 10

    repeat(null, waveCount).map(() => {
      const nextPos = Global.prando.nextArrayItem(circle.getPoints(20))

      createBugWave({
        bugWaveConfig: {
          bugSize: 'small',
          initialCount: 10,
          populReproductionPct: 0,
          reprodStartAfterS: 5,
          reprodSpawnCount: 2,
        },
        pos: nextPos,
      })
    })
  } else if (timeMinute >= 4 && timeMinute < 5) {
    // for circles ! ! !
    const circleIndToCreateFrom = Global.prando.nextInt(4, 6) // circles.length - 1)
    const circle = circles[circleIndToCreateFrom] as Phaser.Geom.Circle

    const waveCount = 5

    repeat(null, waveCount).map(() => {
      const nextPos = Global.prando.nextArrayItem(circle.getPoints(20))

      createBugWave({
        bugWaveConfig: {
          bugSize: 'small',
          initialCount: 10,
          populReproductionPct: 20,
          reprodStartAfterS: 5,
          reprodSpawnCount: 2,
        },
        pos: nextPos,
      })
    })
  } else if (timeMinute >= 5 && timeMinute < 6) {
    // for circles ! ! !
    const circleIndToCreateFrom = Global.prando.nextInt(5, 9) // circles.length - 1)
    const circle = circles[circleIndToCreateFrom] as Phaser.Geom.Circle

    const waveCount = 5

    repeat(null, waveCount).map(() => {
      const nextPos = Global.prando.nextArrayItem(circle.getPoints(20))

      createBugWave({
        bugWaveConfig: {
          bugSize: 'small',
          initialCount: 15,
          populReproductionPct: 30,
          reprodStartAfterS: 5,
          reprodSpawnCount: 2,
        },
        pos: nextPos,
      })
    })
  } else if (timeMinute > 6) {
    // for circles ! ! !
    const circleIndToCreateFrom = Global.prando.nextInt(5, 6) // circles.length - 1)
    const circle = circles[circleIndToCreateFrom] as Phaser.Geom.Circle

    const waveCount = 5

    repeat(null, waveCount).map(() => {
      const nextPos = Global.prando.nextArrayItem(circle.getPoints(20))

      createBugWave({
        bugWaveConfig: {
          bugSize: 'small',
          initialCount: 15,
          populReproductionPct: 50,
          reprodStartAfterS: 5,
          reprodSpawnCount: 2,
        },
        pos: nextPos,
      })
    })

    const waveCountBig = 2
    repeat(null, waveCountBig).map(() => {
      const nextPos = Global.prando.nextArrayItem(circle.getPoints(20))

      createBugWave({
        bugWaveConfig: {
          bugSize: 'big',
          initialCount: 3,
          populReproductionPct: 50,
          reprodStartAfterS: 5,
          reprodSpawnCount: 2,
        },
        pos: nextPos,
      })
    })
  }
}

const INITIAL_ARC_RADIUS = 1000
const createCreationsCircles = () => {
  const arcs = repeat(null, 10).map((_, ind) => {
    const radius = (INITIAL_ARC_RADIUS * (ind + 1)) / 2
    return new Phaser.Geom.Circle(
      Global.earthPos.x + INITIAL_ARC_RADIUS * 0.5 + Global.earthRadius * 2, // the offset is needed due to us rendering /2 / see DPR
      Global.earthPos.y + INITIAL_ARC_RADIUS * 0.5 + Global.earthRadius * 0.5,
      radius
    )

    // For preview only
    // return ObservableScenes.game.add.circle(
    //   Global.earthPos.x + INITIAL_ARC_RADIUS * 0.5 + Global.earthRadius * 2, // the offset is needed due to us rendering /2 / see DPR
    //   Global.earthPos.y + INITIAL_ARC_RADIUS * 0.5 + Global.earthRadius * 0.5,
    //   radius,
    //   0x000000,
    //   0.05
    // )
  })

  return arcs
}
const createCreationsCirclesBGs = () => {
  const bgs = repeat(null, 10).map((_, ind) => {
    // const radius = INITIAL_ARC_RADIUS * (ind + 1)
    const bg = ObservableScenes.game.add
      .image(
        Global.earthPos.x + INITIAL_ARC_RADIUS * 0.5 + Global.earthRadius * 2, // the offset is needed due to us rendering /2 / see DPR
        Global.earthPos.y + INITIAL_ARC_RADIUS * 0.5 + Global.earthRadius * 0.5,
        TEXTURES_MAP.CREATION_CIRCLE
      )
      .setScale(ind + 1)
      .setAlpha(0.25)
      .setName('creation-circle')

    sendToBack(bg)

    return bg
  })

  return bgs
}
