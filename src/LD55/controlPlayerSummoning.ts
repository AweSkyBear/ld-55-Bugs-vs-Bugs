import { Easing, Func, Image, Point, Tween } from '~/common/types'
import {
  constructEvents,
  createThrottledDispatch,
  dispatchEvent,
  getObserversByName,
  IEvent,
  obsDispCreator,
  obsDispEvents,
  ODAPI,
  TEventTarget,
} from '../OD'
import { TEventDispatchOptions } from 'obs-disp/dist/obs-disp'
import { exposeToWindow } from '~/common/debug'
import { events } from './events'
import { createImage } from '~/common/image'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { TEXTURES_MAP } from '~/textures/textures'
import { centerXText } from '~/common/text'
import { mainCam } from '~/common/camera'
import { ODHTMLEvents } from '~/core/createHTMLEvents'
import { Global } from './global/global'

export const PULSATE_DURATION = 2500

export const controlPlayerSummoning = obsDispCreator(
  () => {
    const state = {
      canShoot: false,
      spacebarImg: null as Image,
      tweenPulsate: null as Tween,
      totalSummonCount: Global.summonCountDefault,
    }

    return {
      [obsDispEvents.OBS_CREATE]: () => {
        //
      },
      [events.LD_CROSSHAIR_COUNT_REACHED]: () => {
        state.canShoot = true

        state.spacebarImg = createImage({
          scene: ObservableScenes.foreground,
          texture: TEXTURES_MAP.SPACEBAR,
        })
          .setX(mainCam(ObservableScenes.game).width / 2)
          .setY(mainCam(ObservableScenes.game).height - 100)

        dispatchEvent(events.LD_SPACEBAR_PULSATE_START)

        state.tweenPulsate = ObservableScenes.game.add.tween({
          targets: [state.spacebarImg],
          scale: { from: 1.6, to: 0.5 },
          ease: Easing.Bounce,
          duration: PULSATE_DURATION,
          repeat: -1,
          yoyo: true,
          onUpdate: () => {
            dispatchEvent(events.LD_SPACEBAR_PULSATES, {
              payload: { scale: state.spacebarImg.scale },
              target: getObserversByName('crosshair'),
            })
          },
        })
      },
      [events.LD_SUMMON_SET_COUNT]: (ev) => {
        const { count } = ev.payload
        state.totalSummonCount = count
      },
      [events.LD_PLAYER_SUMMON_ENDED]: () => {
        Global.totalBugsSummoned += state.totalSummonCount

        state.tweenPulsate?.remove()
        state.tweenPulsate = null

        // remove summon-circle's
        getObserversByName('summon-circle').forEach((o) => ODAPI.removeObs(o))

        // Initiate freidnly-bugs summonning for each crosshair
        const crosshairs = getObserversByName('crosshair')
        const crosshairNumber = crosshairs.length
        const summonPerCrosshair = Math.ceil((state.totalSummonCount / crosshairNumber) as any)

        let bugsLeftToSummon = state.totalSummonCount
        crosshairs.forEach((cross) => {
          if (bugsLeftToSummon <= 0) return

          cross.dispatchEvent(events.LD_SUMMON_BUGS_ON_ME, {
            payload: { bugCount: summonPerCrosshair },
            target: cross,
          })
          bugsLeftToSummon -= summonPerCrosshair
        })
        // TODO:1 get the current number of SUMMON FOR !, create from this Crosshair summonFor / 3

        // createFrienlyBug()
      },
      [ODHTMLEvents.HTML_EV_ANY]: ({ payload }) => {
        const { type, wrappedEventArgs } = payload
        // PRESSING SPACE
        if (state.canShoot && type === 'keydown' && wrappedEventArgs[0].key === ' ') {
          dispatchEvent(events.LD_PLAYER_SUMMON)

          state.canShoot = false
          state.spacebarImg.alpha = 0
        }
      },
      [obsDispEvents.OBS_REMOVE]: () => {
        // TODO
      },
    }
  },
  { id: 'control-player-shooting' }
)
