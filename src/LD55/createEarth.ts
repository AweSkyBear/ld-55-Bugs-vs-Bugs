import { Func, GameObject, ICollisionPair, Image, Point } from '~/common/types'
import {
  constructEvents,
  createThrottledDispatch,
  dispatchEvent,
  IEvent,
  IObserver,
  ObsDispCreate,
  obsDispCreator,
  obsDispEvents,
  ODAPI,
  TEventTarget,
} from '../OD'
import { TEventDispatchOptions } from 'obs-disp/dist/obs-disp'
import { exposeToWindow } from '~/common/debug'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { mainCam } from '~/common/camera'
import { sceneEvents } from '~/events/sceneEvents'
import { Global } from './global/global'
import { createMttrGameObj } from '~/core/createMttrGameObj'
import { IMatterSpriteFixed, MatterObjActions } from '~/common/matter'
import { TEXTURES_MAP } from '~/textures/textures'
import { COLLISION_CATEGORY } from '~/game/airbornDelivery/const/CollisionsCategory'
import { getCollBodyNames } from '~/core/matterObj'
import { events } from './events'

const LOSE_HP_ON_BUG = 1

export const createEarth = obsDispCreator(
  () => {
    const scene = ObservableScenes.game

    const state = {
      obs: null as IObserver,
      earthImg: null as Image,
      earthImgMttr: null as IMatterSpriteFixed,
    }

    const handleEarthHPDecreased = () => {
      // TODO:continue -> update the HP bar
      state.earthImg &&
        scene.add.tween({
          targets: [state.earthImg],
          alpha: { from: 1, to: 0.5 },
          duration: 300,
          yoyo: true,
        })
    }

    return {
      [obsDispEvents.OBS_CREATE]: ObsDispCreate.useObs((obs) => {
        state.obs = obs

        const RADIUS = 200
        const POS = { x: mainCam(scene).width / 2, y: mainCam(scene).height - 200 }
        state.earthImg = scene.add
          .image(POS.x, POS.y, TEXTURES_MAP.EARTH, 0x00ff)
          .setScale((RADIUS / 600) * 2, (RADIUS / 600) * 2)

        state.obs = obs
        state.earthImgMttr = createMttrGameObj({
          scene,
          isSprite: true,
          texture: TEXTURES_MAP.NO_TEXTURE,
          name: 'earth',
          isCircle: true,
          physicsProps: {
            radius: RADIUS,
            mass: 50,
            frictionAir: 1,
          },
        })
          .setPosition(POS.x, POS.y)
          .setCollisionCategory(COLLISION_CATEGORY.Player)
          .setCollidesWith([
            COLLISION_CATEGORY.Enemy,
            COLLISION_CATEGORY.Player,
            COLLISION_CATEGORY.PlayerProjectile,
          ])
          .setOnCollideActive((collision: ICollisionPair) => {
            if (!Global.isEvery30thFrame) return

            const bodyNames = getCollBodyNames(collision)
            if (bodyNames.includes('bug-enemy')) {
              console.log('EARTH LOSING HP')

              Global.earthHp -= LOSE_HP_ON_BUG // TODO:LATER:CONFIG - current hit power of a bug
              Global.earthHp = Math.max(0, Global.earthHp)

              Global.selectedSummonCount = Math.min(Global.selectedSummonCount, Global.earthHp)

              dispatchEvent(events.LD_EARTH_HIT, { payload: { hp: Global.earthHp } })
              handleEarthHPDecreased()

              // TODO: decrease
              if (Global.earthHp <= 0) {
                ODAPI.removeObs(obs)
                dispatchEvent(events.LD_GAME_LOST)
                dispatchEvent(events.LD_GAME_ENDED)
              }
            }
          }) as any
      }),
      [events.LD_EARTH_DECREASED_HP]: (ev) => {
        // const { hpDecrement } = ev.payload
        // Global.earthHp -= Math.max(0, hpDecrement)
      },
      [events.LD_EARTH_INCREASED_HP]: (ev) => {
        // const { hpIncrement } = ev.payload
        // Global.earthHp += hpIncrement
      },
      [sceneEvents.UPDATE]: () => {
        if (!state.earthImgMttr) return
        Global.earthPos.x = state.earthImgMttr.x
        Global.earthPos.y = state.earthImgMttr.y

        state.earthImg.x = state.earthImgMttr.x
        state.earthImg.y = state.earthImgMttr.y
      },
      [obsDispEvents.OBS_REMOVE]: () => {
        MatterObjActions.destroyAll([state.earthImgMttr, state.earthImg])
        state.earthImg = null
        state.earthImgMttr = null
      },
    }
  },
  { name: 'earth' }
)
