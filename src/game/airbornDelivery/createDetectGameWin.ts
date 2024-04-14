import {
  addObsDisp,
  createThrottledDispatch,
  dispatchEvent,
  obsDispEvents,
  payloadProp,
} from '~/OD'
import { Easing, Point, Tween } from '~/common/types'
import { sceneEvents } from '~/events/sceneEvents'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { gameEvents } from '~/events/gameEvents'
import { getObjPos } from '~/common/func'
import { IMatterObj, MatterObjActions } from '~/common/matter'
import { getDistanceToClosestObjFrom } from '~/common/distance'
import { getCrate } from './global/CrateSingleton'
import { debugLog, exposeToWindow } from '~/common/debug'
import { isInGame } from './global/GameStateSingleton'
import { getCamScrollPos } from '~/common/camera'
import throttle from '~/common/throttle'

const dispatchGameWon = throttle(1000, () => dispatchEvent('GAME_WON'))
const dispatchCreateGameWonToast = throttle(1000, () =>
  dispatchEvent('TOAST_CREATE', { payload: { text: 'Level Won!' } })
)

export const createDetectGameWin = (config?: { pos: Point }) => {
  const scene = ObservableScenes.game

  const state = {
    flags: [] as IMatterObj[],
    tweenCounter: null as Tween,
    timeToWinMs: 3000,
    smallestDistanceToWin: 200,
    nearestFlag: null as IMatterObj,
    isNearFlag: false,
    _color: new Phaser.Display.Color(0, 0, 0, 255),
    crateStopped: false,
    crateEjected: false,
  }

  const crateIsStopped = () => {
    return getCrate().body.velocity.x === 0 && getCrate().body.velocity.y === 0
  }

  const findClosestFlag = () => {
    // workaround
    return getCrate()?.body && getDistanceToClosestObjFrom(getObjPos(getCrate()), state.flags)
  }
  return addObsDisp({
    [obsDispEvents.OBS_CREATE]: ({ payload: {} }) => {
      // todo? child observers?
    },
    [gameEvents.GAME_START]: () => {
      state.crateEjected = false
      state.crateStopped = false
    },
    ['GROUND_FLAGS_CREATED']: (ev) => {
      if (!isInGame()) return

      debugLog('GROUND_FLAGS_CREATED', ev.payload)
      state.flags = payloadProp<IMatterObj[]>('flags')(ev)

      //   state.skyBgImg = createImage({ scene, texture: TEXTURES_MAP.SKY_BACKGROUND })
      //   state.skyBgImg.scaleX = 4000
      //   state.skyBgImg.scaleY = 4ftate._color.setFromR
    },
    ['CRATE_NEAR_FLAG']: (ev) => {
      if (!isInGame()) return

      debugLog('CRATE_NEAR_FLAG', ev.payload)
      const isNear = payloadProp('isNear')(ev)

      state.tweenCounter?.remove()
      state.tweenCounter = null

      !isNear && state.tweenCounter?.remove()
      if (isNear && !state.tweenCounter) {
        state.tweenCounter = scene.tweens.addCounter({
          from: 0,
          to: 100,
          delay: state.timeToWinMs,
          ease: Easing.Quintic.In,
          onUpdate: (tween) => {
            if (!isInGame()) return
            // if (!state.nearestFlag) state.tweenCounter.remove()

            const pct = tween.getValue()
            state._color.setFromRGB({ r: 0, g: 255 * (pct / 100), b: 0 })

            const color = parseInt(
              `0x${
                Phaser.Display.Color.ComponentToHex(state._color.red) +
                Phaser.Display.Color.ComponentToHex(state._color.green) +
                Phaser.Display.Color.ComponentToHex(state._color.blue)
              }`,
              16
            )

            // SAFETY
            state.nearestFlag = findClosestFlag()?.closestObj as any

            state.nearestFlag?.setTintFill(color)

            exposeToWindow({ _color: state._color })

            //console.log('PCT', pct, color, 'isNear', isNear) // TODO:LD: make the flag greener !
            if (pct >= 100) {
              // TODO:LD:DEBUG - enable after
              setTimeout(() => dispatchGameWon(), 3000)
              dispatchCreateGameWonToast()

              // failsafe:
              scene.cameras.main.stopFollow()

              state.tweenCounter.remove()
            }
          },
        })
      }
      // if (_state.keySpace && scene.input.keyboard.checkDown(_state.keySpace, 500)) {
      //   _state.isPaused = !_state.isPaused
      //   _state.isPaused ? GameFlow.pauseGame() : GameFlow.resumeGame()
      //   debugLog('PAUSED')
      // }
    },
    [gameEvents.CRATE_EJECT]: () => {
      setTimeout(() => (state.crateEjected = true))
    },
    [sceneEvents.UPDATE]: () => {
      if (!isInGame()) return

      if (!MatterObjActions.isSafe(getCrate()) || state.flags.length <= 0) return

      const { closestObj, smallestDist } = getDistanceToClosestObjFrom(
        getObjPos(getCrate()),
        state.flags
      )
      if (smallestDist <= state.smallestDistanceToWin) {
        state.nearestFlag = closestObj as any
        if (!state.isNearFlag) {
          dispatchEvent('CRATE_NEAR_FLAG', { payload: { isNear: true } })
          //console.log('CRATE_NEAR_FLAG true')
          state.isNearFlag = true
        }

        // getCrate().setTintFill(0x0000ff) // LD:DEBUG
      } else {
        state.nearestFlag = null
        if (state.isNearFlag) {
          dispatchEvent('CRATE_NEAR_FLAG', { payload: { isNear: false } })
          //console.log('CRATE_NEAR_FLAG false')
          state.isNearFlag = false
        }

        // if (stat)
        if (state.crateEjected && crateIsStopped()) {
          //// console.log('___CRATE IS STOPPED')
        }
        if (state.crateEjected && crateIsStopped() && !state.crateStopped) {
          //console.log('CRATE IS STOPPED')
          state.crateStopped = true
          dispatchEvent('CRATE_STOPPED', { payload: { isNear: false } })
        }

        // getCrate().setTintFill(0xaaffff) // LD:DEBUG
      }

      //// console.log('nearestFlag', state.nearestFlag)
      exposeToWindow({ nearestFlag: state.nearestFlag })

      ////

      // TODO:LD:DO THIS ???
      if (!state.isNearFlag && state.nearestFlag) {
        dispatchEvent('CRATE_NEAR_FLAG', { payload: { isNear: true } })
        state.tweenCounter?.restart()
      } else if (state.isNearFlag && state.nearestFlag) {
        // check if flag will become far away!
        const { smallestDist: dist } = getDistanceToClosestObjFrom(getObjPos(getCrate()), [
          state.nearestFlag,
        ])
        if (dist > state.smallestDistanceToWin) {
          dispatchEvent('CRATE_NEAR_FLAG', { payload: { isNear: false } })
          state.nearestFlag.setTintFill(0xff5555)
          state.nearestFlag = null
          state.isNearFlag = false
          // TODO: return the original tint - RED
        }
      }
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      // GlobalObservers.removeMultipleObs(observers)
      // _state.keySpace?.destroy()
      // _state.keySpace = null
    },
  })
}
