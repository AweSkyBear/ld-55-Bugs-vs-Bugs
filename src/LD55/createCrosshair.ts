import { Easing, Func, Point, Tween } from '~/common/types'
import {
  constructEvents,
  createThrottledDispatch,
  dispatchEvent,
  getObserversByName,
  IEvent,
  IObserver,
  ObsDispCreate,
  obsDispCreator,
  obsDispEvents,
  removeObs,
  TEventTarget,
} from '../OD'
import { TEventDispatchOptions } from 'obs-disp/dist/obs-disp'
import { exposeToWindow } from '~/common/debug'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { MatterObjActions } from '~/common/matter'
import { mainCam } from '~/common/camera'
import { TEXTURES_MAP } from '~/textures/textures'
import { events } from './events'
import { payloadPropOr } from 'obs-disp'
import { PULSATE_DURATION } from './controlPlayerSummoning'
import { createProjectile } from './createProjectile'
import { getObjPos } from '~/common/point'
import { createFrienlyBug } from './createFriendlyBug'
import { createSummoningCircle } from './createSummoingCircle'
import { repeat } from 'ramda'
import { Global } from './global/global'
import { defer } from 'obs-disp/dist/func'

export const createCrosshair = obsDispCreator<{
  pos: Point
  ind: number
  tint?: number
  initialScale?: number
  removeSoonAfter?: boolean
}>(
  (
    { pos, tint, ind, initialScale: _initialScale, removeSoonAfter } = { initialScale: 1 } as any
  ) => {
    const scene = ObservableScenes.game
    const initialScale = _initialScale || 1

    const state = {
      self: null as IObserver,
      crosshair: null as Phaser.GameObjects.Image,
      pulsatingScale: 1,
      tweenPulsate: null as Tween,
    }

    const destroy = () => {
      removeObs(state.self)
      // MatterObjActions.destroy(state.crosshair)
      // state.crosshair = null
    }

    const createPulsateTween = () => {
      state.tweenPulsate?.destroy()

      state.tweenPulsate = scene.add.tween({
        targets: [state.crosshair],
        scale: {
          from: 1.5 * initialScale + state.pulsatingScale,
          to: 0.5 * initialScale + state.pulsatingScale,
        },
        // onUpdate: (tween) => {
        //   const scale = tween.getValue()
        // },
        ease: Easing.Cubic,
        duration: PULSATE_DURATION,
        repeat: -1,
        yoyo: true,
      })
    }
    return {
      [obsDispEvents.OBS_CREATE]: ObsDispCreate.useObs((obs) => {
        state.self = obs

        state.crosshair = ObservableScenes.game.add
          .image(pos.x, pos.y, TEXTURES_MAP.CROSSHAIR)
          .setTint(removeSoonAfter ? 0xff0000 : tint || 0x00ff)
          .setAlpha(0.7)
          .setAngle(Math.random() * 359)

        // get angle to 0
        scene.add.tween({
          targets: [state.crosshair],
          angle: { from: state.crosshair.angle, to: 0 },
          duration: 2000,
        })

        // initial scaling tween
        if (!removeSoonAfter) {
          scene.add.tween({
            targets: [state.crosshair],
            scale: { from: 1.1 * initialScale, to: 0.9 * initialScale },
            ease: Easing.Cubic,
            duration: 1500,
            repeat: 0,
            yoyo: true,
            onComplete: () => {
              state.crosshair &&
                scene.add.tween({
                  targets: [state.crosshair],
                  alpha: { from: 1.1, to: 0.5 },
                  ease: Easing.Cubic,
                  duration: 1500,
                  repeat: -1,
                  yoyo: true,
                })
            },
          })
        } else {
          scene.add.tween({
            targets: [state.crosshair],
            scale: { from: 1.1 * initialScale, to: 0.9 * initialScale },
            ease: Easing.Cubic,
            duration: 500,
            repeat: 0,
            yoyo: true,
            onComplete: () => {
              destroy()
              dispatchEvent(events.LD_CROSSHAIR_REMOVED, {
                target: getObserversByName('control-crosshair-creation'),
              })
            },
          })
        }
      }),
      [events.LD_SPACEBAR_PULSATE_START]: (ev) => {
        createPulsateTween()
      },
      [events.LD_SPACEBAR_PULSATES]: (ev) => {
        const scale = payloadPropOr<number>('scale', 1)(ev)
        state.pulsatingScale = scale
      },
      [events.LD_PLAYER_SUMMON]: () => {
        createSummoningCircle({
          pos: getObjPos(state.crosshair),
          radius: state.pulsatingScale * 50,
        })

        scene.add.tween({
          targets: [state.crosshair],
          scale: { to: 0.5 },
          alpha: { to: 0.3 },
          /*

        scale: { from: 1, to: 0.5 },
        alpha: { from: 1, to: 0.3 },
        */
          ease: Easing.Cubic,
          duration: 1500,
          repeat: 0,
          onComplete: () => {
            // !Global.summonEnded -> only once
            !Global.summonEnded && dispatchEvent(events.LD_PLAYER_SUMMON_ENDED)
            Global.summonEnded = true
            defer(() => {
              destroy()
              Global.summonEnded = false
            })
          },
        })
      },
      [events.LD_SUMMON_BUGS_ON_ME]: (ev) => {
        const bugCount = ev.payload.bugCount
        const newBugs = repeat(null, bugCount).map(() => createFrienlyBug({ pos, type: 'small' }))

        // TODO:CONTINUE - friendly bug config?
      },
      [obsDispEvents.OBS_REMOVE]: () => {
        //
        MatterObjActions.destroyAll([state.crosshair])
        state.crosshair = null
      },
    }
  },
  { name: 'crosshair' }
)
