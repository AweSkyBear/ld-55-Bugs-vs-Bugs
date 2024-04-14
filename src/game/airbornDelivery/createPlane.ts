import { Point } from '~/common/types'
import { IObserver, addObsDisp, dispatchEvent, payloadProp, obsDispEvents } from '~/OD'
import { sceneEvents } from '~/events/sceneEvents'
import { createMttrGameObj } from '~/core/createMttrGameObj'
import { IMatterSpriteFixed, MatterObjActions } from '~/common/matter'
import { OBJECT_NAMES } from '~/game/airbornDelivery/const/ObjectNames'
import { TEXTURES_MAP } from '~/textures/textures'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { gameEvents } from '~/events/gameEvents'
import { defaultTo, pathOr, propOr } from 'ramda'
import { exposeToWindow } from '~/common/debug'
import { inputEvents } from '~/events/inputEvents'
import { addPoints, getObjPos } from '~/common/func'
import { Plane } from './const/Plane'
import { velocityFromAngle } from '~/common/direction'
import { TPlaneState } from './types/TPlaneState'
import { getPlane, setPlane } from './global/PlaneSingleton'
import { COLLISION_CATEGORY } from '~/game/airbornDelivery/const/CollisionsCategory'
import { mainCam } from '~/common/camera'
import { isInGame } from './global/GameStateSingleton'
import throttle from '~/common/throttle'

// const dispatchCreateToastNotInEjectArea = thrott createThrottledDispatch(
//   { name: 'TOAST_CREATE', payload: { text: 'Not in eject area (green zone)!' } },
//   { throttleMs: 1000 }
// )
const dispatchCreateToastNotInEjectArea = throttle(
  1000,
  () =>
    dispatchEvent('TOAST_CREATE', {
      payload: {
        text: 'Not in eject area (green zone)!',
      },
    }),
  {
    // noTrailing: true,
  }
)

export const createPlane = (config?: { pos: Point }) => {
  const observers: IObserver[] = []
  const scene = ObservableScenes.game

  const configPos = pathOr(Plane.initialPos, ['pos'])(config)

  const state = {
    plane: null as IMatterSpriteFixed,
    planeState: 'FLYING' as TPlaneState,
    controls: {
      up: false,
      down: false,
      space: false,
      e: false,
    },
    planePhysVariables: {
      velo: { x: 0, y: 0 },
      speed: Plane.initalSpeed,
      angleChangeOnUpDown: Plane.initialAngleChangeOnUpDown,
    },
    inEjectArea: false,
  }

  /** Use this to remove a bug */
  // const dispatchCrateEject: any = createThrottledDispatch(
  //   { name: gameEvents.CRATE_EJECT },
  //   {
  //     throttleMs: 1000,
  //   }
  // )
  const dispatchCrateEject = throttle(1000, (...args) =>
    dispatchEvent(gameEvents.CRATE_EJECT, ...args)
  )

  return addObsDisp({
    [obsDispEvents.OBS_CREATE]: ({ payload: {} }) => {
      // todo? child observers?
    },
    [gameEvents.GAME_START]: () => {
      state.plane && MatterObjActions.destroy(state.plane)
      //
      state.plane = createMttrGameObj<IMatterSpriteFixed>({
        scene,
        isSprite: true,

        // TODO:REFACTOR: move the `name` inside HAGObjectProps?
        name: OBJECT_NAMES.PLANE,
        pos: configPos,
        texture: TEXTURES_MAP.PLANE,
        physicsProps: {
          rectangleSize: { width: 270 - 60, height: 188 / 2 - 40 },
          gravity: 0,
          ignoreGravity: true,
        },
        // anim: ANIMS_MAP.BIRD_FLAPPING_1,
      })
        .setSensor(true)
        .setCollisionCategory(COLLISION_CATEGORY.Player)
        .setCollidesWith([
          COLLISION_CATEGORY.Ground,
          COLLISION_CATEGORY.Enemy,
          COLLISION_CATEGORY.EjectArea,
        ])

      // make cam follow
      state.plane.scene.cameras.main.startFollow(state.plane, false, 0.05, 0.1, -300, 0)

      // state.plane.setBody({ width: 270, height: 188 }).setIgnoreGravity(true)
      state.planeState = 'FLYING'
      setPlane(state.plane)
      // TEMP:
      // state.plane.setStatic(true)

      ///// collisions
      state.plane.setOnCollide(({ bodyA, bodyB }) => {
        console.log('body')
        if (bodyA.label === OBJECT_NAMES.EJECT_AREA || bodyB.label === OBJECT_NAMES.EJECT_AREA) {
          state.inEjectArea = true
          // console.log('IN EJECT AREA', true)
        } else {
          // it must be the only other one - ground, in which case we crashed!
          dispatchEvent(gameEvents.GAME_REQUEST_RESTART)
        }
      })
      state.plane.setOnCollideEnd(({ bodyA, bodyB }) => {
        console.log('body onCollideEnd')
        if (bodyA.label === OBJECT_NAMES.EJECT_AREA || bodyB.label === OBJECT_NAMES.EJECT_AREA) {
          state.inEjectArea = false
          // console.log('IN EJECT AREA', false)
        }
      })

      exposeToWindow({ plane: state.plane })
    },
    [gameEvents.GAME_EDIT]: () => {
      state.plane.setStatic(true)
    },
    [gameEvents.GAME_EDIT_EXIT]: () => {
      state.plane.setStatic(false)
    },
    // [inputEvents.SPACE]: (ev) => {
    //   console.log('SPACE')
    // },
    [inputEvents.INPUT_UPDATE_STATE]: (ev) => {
      const keys = payloadProp<Record<string, boolean>>('keys')(ev)
      state.controls.up = keys.ArrowUp || keys.w
      state.controls.down = keys.ArrowDown || keys.s
      state.controls.space = keys[' ']
      state.controls.e = keys.e
      state.controls.space && console.log('SPACE', state.controls.space)
    },
    [sceneEvents.UPDATE]: (ev) => {
      const fixedStepMs = 1000 / 60

      if (!MatterObjActions.isSafe(getPlane())) return
      if (!isInGame() || !state.plane.active || state.plane.isStatic()) return

      // console.log('STATE    IN EJECT AREA', state.inEjectArea)

      if (state.controls.up) {
        //
        state.plane.angle -= state.planePhysVariables.angleChangeOnUpDown / fixedStepMs
      } else if (state.controls.down) {
        //
        state.plane.angle += state.planePhysVariables.angleChangeOnUpDown / fixedStepMs
      }

      if (state.controls.e && state.inEjectArea && state.planeState !== 'CRATE_EJECTED') {
        state.planeState = 'CRATE_EJECTED'
        dispatchCrateEject({
          payload: { pos: addPoints(getObjPos(state.plane), state.plane.body.velocity) },
        } as any)
      } else if (state.controls.e && !state.inEjectArea && state.planeState !== 'CRATE_EJECTED') {
        dispatchCreateToastNotInEjectArea()
      }

      const angle = propOr(0, 'angle', getPlane()) as number
      const posChangeVector = velocityFromAngle(
        angle,
        (state.planePhysVariables.speed / fixedStepMs) * (state.controls.space ? 2 : 1)
      )
      //// X: old - now  using setVelocity
      // state.plane.x += (posChangeVector.x * (state.controls.space ? 2 : 1)) / fixedStepMs
      // state.plane.y += (posChangeVector.y * (state.controls.space ? 2 : 1)) / fixedStepMs
      state.plane.setVelocity(posChangeVector.x, posChangeVector.y)

      // state.plane.x += 2 * (state.controls.up ? 1 : 0)

      // if (_state.keySpace && scene.input.keyboard.checkDown(_state.keySpace, 500)) {
      //   _state.isPaused = !_state.isPaused
      //   _state.isPaused ? GameFlow.pauseGame() : GameFlow.resumeGame()
      //   debugLog('PAUSED')
      // }
    },
    [gameEvents.GAME_PAUSE]: () => {
      // mainCam(scene).stopFollow()
    },
    [gameEvents.GAME_RESUME]: () => {
      state.planeState === 'FLYING' &&
        state.plane.scene.cameras.main.startFollow(state.plane, false, 0.05, 0.1, -300, 0)
    },
    GAME_RESTART: () => {
      // GlobalObservers.removeMultipleObs(observers)
      state.plane?.scene?.cameras?.main.stopFollow()
      MatterObjActions.destroy(state.plane)
      state.planeState = 'FLYING'
      // _state.keySpace?.destroy()
      // _state.keySpace = null
    },
    GAME_WON: () => {
      // GlobalObservers.removeMultipleObs(observers)
      state.plane?.scene?.cameras?.main.stopFollow()
      MatterObjActions.destroy(state.plane)
      state.planeState = 'FLYING'
      // _state.keySpace?.destroy()
      // _state.keySpace = null
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      // GlobalObservers.removeMultipleObs(observers)
      MatterObjActions.destroy(state.plane)
      // _state.keySpace?.destroy()
      // _state.keySpace = null
    },
  })
}
