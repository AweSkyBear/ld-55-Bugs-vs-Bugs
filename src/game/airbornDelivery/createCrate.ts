import { addObsDisp, obsDispEvents } from '~/OD'
import { Point } from '~/common/types'
import { sceneEvents } from '~/events/sceneEvents'
import { createMttrGameObj } from '~/core/createMttrGameObj'
import { IMatterSpriteFixed, MatterObjActions } from '~/common/matter'
import { OBJECT_NAMES } from '~/game/airbornDelivery/const/ObjectNames'
import { TEXTURES_MAP } from '~/textures/textures'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { gameEvents } from '~/events/gameEvents'
import { exposeToWindow, useDebugConstant } from '~/common/debug'
import { inputEvents } from '~/events/inputEvents'
import { payloadProp } from '~/OD'
import { velocityFromAngle } from '~/common/direction'
import { TCrateState } from './types/TCrateState'
import { getPlane } from './global/PlaneSingleton'
import { getPosition } from '~/core/matterObj'
import { Crate } from './const/Crate'
import { sendToTop } from '~/common/scene'
import { COLLISION_CATEGORY } from '~/game/airbornDelivery/const/CollisionsCategory'
import { setCrate } from './global/CrateSingleton'

export const createCrate = () => {
  // console.log('createCrate')
  const scene = ObservableScenes.game

  const state = {
    crate: null as IMatterSpriteFixed,
    crateRT: null as Phaser.GameObjects.RenderTexture,
    crateState: 'NONE' as TCrateState,
    cratePhysVariables: {
      currentFPSFactor: 1,

      gravity: 1,
      ejectAngularVelo: 0.015,
      maxAngularVelo: 0.15, // should be same as ejectAngularVelo
      frictionAir: 0.005,
      frictionStatic: 0.55,
      bounce: 0.55, //0.55 * (60 / 144), // TODO:LD:config - Rubber one -> higher bounce!

      ejectSpeedFactor: Crate.ejectVeloFactor,
      angularVeloFactor: Crate.angularVeloFactor,
      // angleChangeOnUpDown: Plane.initialAngleChangeOnUpDown
    },
    keySpace: false,
    _deltaAccum: 0,
    _pos: null as any,
    _deltaDivisor: 0,
  }

  return addObsDisp(
    {
      [sceneEvents.POST_UPDATE]: (ev) => {
        // state.crate && console.log('crate pos', state.crate.x, state.crate.y)
        // state.crate &&
        //   state.crate.setPosition(numToFixed(state.crate.x, 1), numToFixed(state.crate.y, 1))
        // state.crate && (state.crate.alpha = ev.payload.isUpdatingThisStep ? 0 : 0) // 0 ALWAYS
        // state.crate && state.crate.setActive(ev.payload.isUpdatingThisStep)
        // if (ev.payload.isUpdatingThisStep && state.crate) {
        //   state.crateRT =
        //     state.crateRT || scene.add.renderTexture(0, 0, state.crate.width, state.crate.height)
        //   state.crateRT.alpha = 1
        //   state.crateRT.setPosition(state.crate.x, state.crate.y)
        //   state.crateRT.setAngle(state.crate.angle)
        //   state.crateRT.drawFrame(state.crate.texture.key)
        //   state.crateRT.drawFrame(state.crate.texture.key)
        //   state.crateRT.drawFrame(state.crate.texture.key)
        //   state.crateRT.drawFrame(state.crate.texture.key)
        //   state.crateRT.drawFrame(state.crate.texture.key)
        //   state.crateRT.drawFrame(state.crate.texture.key)
        //   state.crateRT.drawFrame(state.crate.texture.key)
        //   state.crateRT.drawFrame(state.crate.texture.key)
        //   state.crateRT.drawFrame(state.crate.texture.key)
        //   state.crateRT.drawFrame(state.crate.texture.key)
        // } else {
        //   state.crateRT && (state.crateRT.alpha = 0.5)
        //   // state.crateRT && state.crateRT.destroy()
        //   // state.crateRT = null
        // }
        // console.log('POST_UPDATE isUpdatingThisStep', ev.payload.isUpdatingThisStep)
      },
      // [sceneEvents.DRAW_RESUME]: (ev) => {
      //   state.crate && (state.crate.alpha = 1)
      //   // state.crate && (state.crate.active = true)
      //   state._pos = state.crate && { x: state.crate.x, y: state.crate.y }
      //   console.log('DRAW_RESUME delta', ev.payload.delta, ev.payload.time)
      // },
      // [sceneEvents.DRAW_HALT]: (ev) => {
      //   if (state.crate) {
      //     state.crate.x = state._pos.x
      //     state.crate.y = state._pos.y
      //   }
      //   // state._pos = state.crate && { x: state.crate.x, y: state.crate.y }
      //   state.crate && (state.crate.alpha = 0)
      //   // state.crate && (state.crate.active = false)
      //   console.log('DRAW_HALT delta', ev.payload.delta, ev.payload.time)
      // },
      [obsDispEvents.OBS_CREATE]: ({ payload: {} }) => {
        // todo? child observers?
      },
      // TESTING:
      [inputEvents.GLOBAL_POINTER_DOWN]: (ev) => {
        const worldPos = payloadProp<Point>('worldPos')(ev)
        // console.log('worldPos', worldPos)
      },
      [gameEvents.CRATE_EJECT]: (ev) => {
        // LD:BUG:FIX:WORKAROund
        if (state.crate) return

        sendToTop(getPlane())
        const pos = payloadProp<Point>('pos')(ev)

        // console.log('crate create')
        const plane = getPlane()
        const veloFromAngle = velocityFromAngle(plane.angle + 45, 0.55)
        const initialVelocity = {
          x:
            0.02 *
            state.cratePhysVariables.ejectSpeedFactor *
            (state.keySpace ? 80 : 1) *
            useDebugConstant('xIncr', 1),
          y: 0.02 * useDebugConstant('yIncr', 1),
        } as any

        state.crate = createMttrGameObj<IMatterSpriteFixed>({
          scene,
          isSprite: true,

          // TODO:REFACTOR: move the `name` inside HAGObjectProps?
          name: OBJECT_NAMES.CRATE,
          pos: getPosition(plane),
          texture: TEXTURES_MAP.CRATE,
          physicsProps: {
            gravity: 1,
            frictionAir: state.cratePhysVariables.frictionAir,
            frictionStatic: state.cratePhysVariables.frictionStatic,
            bounce: state.cratePhysVariables.bounce, //0.55 * (60 / 144), // TODO:LD:config - Rubber one -> higher bounce!
            // gravity: 1,
            // frictionAir: 0.005,
            // frictionStatic: 0.55,
            // bounce: 0.5, //0.55 * (60 / 144), // TODO:LD:config - Rubber one -> higher bounce!
            // gravity: 1,
          },
        })
          .setCollisionCategory(COLLISION_CATEGORY.Player)
          .setCollidesWith([COLLISION_CATEGORY.Ground, COLLISION_CATEGORY.Enemy])
          .setPosition(pos.x, pos.y)

        setCrate(state.crate)

        /////// make cam follow after created
        scene.cameras.main.startFollow(state.crate, false, 0.05, 0.5, -300, 0)

        ///// NEW WAY TO DO IT ::: - first setVelocity
        const FORCE_MULTIP = 50
        const velo = {
          x: initialVelocity.x + veloFromAngle.x * FORCE_MULTIP,
          y: initialVelocity.y + veloFromAngle.y * FORCE_MULTIP,
        }
        console.log('VELO', velo)
        state.crate.setVelocity(velo.x, velo.y)
        state.crate.setAngularVelocity(state.cratePhysVariables.ejectAngularVelo)

        // state.crate.setVelocity(state.crate.getVelocity().x, state.crate.getVelocity().y)
        //
        ///// <-

        exposeToWindow({ crate: state.crate })
      },
      [gameEvents.GAME_RESTART]: () => {
        // TODO:
      },
      [gameEvents.GAME_START]: () => {
        // nothing
        // TEMP:
        // exposeToWindow({ plane: state.plane })
      },
      [gameEvents.GAME_RESUME]: () => {
        state.crateState === 'CRATE_EJECTED' &&
          scene.cameras.main.startFollow(state.crate, false, 0.05, 0.5, -300, 0)
      },
      [inputEvents.INPUT_UPDATE_STATE]: (ev) => {
        const keys = payloadProp<Record<string, boolean>>('keys')(ev)
        state.keySpace = keys[' ']
        // state.down = keys.ArrowDown
      },
      [sceneEvents.UPDATE]: (ev) => {
        if (!state.crate) return

        const { currentFPSFactor } = ev.payload as { currentFPSFactor: number }
        state.cratePhysVariables.currentFPSFactor = currentFPSFactor /// !IMPORTANT

        //// diff-refresh-rate issue: REGULATE THE BOUNCE
        // state.crate.setBounce(state.cratePhysVariables.bounce * currentFPSFactor)
        // TODO: >>>>>>>>>>>>> do this only if NOT touching anything

        //// RESTRAIN IT
        /// HIGHER-MOITOR-REFRESH-RATE-ISSUES:SOLVED -
        const angularVelo = state.crate.getAngularVelocity()
        const maxAngVelo = state.cratePhysVariables.maxAngularVelo
        angularVelo >= maxAngVelo && state.crate.setAngularVelocity(maxAngVelo)
        angularVelo < -maxAngVelo && state.crate.setAngularVelocity(-maxAngVelo)

        sendToTop(state.crate) // make sure not behind anything
      },
      GAME_RESTART: () => {
        // console.log('removing crate')
        state.crate && MatterObjActions.destroy(state.crate)
        state.crate = null
        state.crateState = 'NONE'
        // GlobalObservers.removeMultipleObs(observers)
        // _state.keySpace?.destroy()
        // _state.keySpace = null
      },
      GAME_WON: () => {
        // console.log('removing crate')
        state.crate && MatterObjActions.destroy(state.crate)
        state.crate = null
        state.crateState = 'NONE'
        // GlobalObservers.removeMultipleObs(observers)
        // _state.keySpace?.destroy()
        // _state.keySpace = null
      },
      [obsDispEvents.OBS_REMOVE]: () => {
        // console.log('removing crate')
        state.crate && MatterObjActions.destroy(state.crate)
        state.crate = null

        state.crateRT && state.crateRT.destroy()
        state.crateRT = null
        // GlobalObservers.removeMultipleObs(observers)
        // _state.keySpace?.destroy()
        // _state.keySpace = null
      },
    },
    { id: 'crate' }
  )
}
