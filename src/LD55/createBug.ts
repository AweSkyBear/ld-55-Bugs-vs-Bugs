import { Func, ICollisionPair, Image, MatterImage, Point } from '~/common/types'
import {
  dispatchEvent,
  IObserver,
  obsDispCreator,
  obsDispEvents,
  ODAPI,
  removeObs,
  TEventTarget,
} from '../OD'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { TEXTURES_MAP } from '~/textures/textures'
import { always, cond, defaultTo, repeat } from 'ramda'
import { basedOn, getObjPos } from '~/common/func'
import { sceneEvents } from '~/events/sceneEvents'
import { getAngleFromVelocity, velocityToTarget } from '~/common/direction'
import { Global } from './global/global'
import { createMttrGameObj } from '~/core/createMttrGameObj'
import { COLLISION_CATEGORY } from '~/game/airbornDelivery/const/CollisionsCategory'
import { getCollBodyNames } from '~/core/matterObj'
import { ObsDispCreate } from 'obs-disp'
import { IMatterImageFixed, MatterObjActions } from '~/common/matter'
import { events } from './events'
import { createBugForWave } from './createBugWave'
import { IBugWaveConfig } from './interfaces/IBugWaveConfig'
import { TBugFraction } from './interfaces/TBugFraction'
import { TBugSize } from './interfaces/TBugSize'
import { findClosestOf } from '~/common/distance'

const START_HP = 100
const SPEED = 0.5 // 0.1 - default

// import HueRotatePostFX from '../fx/pipelines/pipelines'
export const createBug = obsDispCreator<{
  pos: Point
  type: TBugSize
  fraction?: TBugFraction
}>(
  (props) => {
    const scene = ObservableScenes.game
    const state = {
      obs: null as IObserver,
      bug: null as MatterImage,
      hp: START_HP,
      // glowFx: null as Phaser.FX.Glow,
    }

    const fraction = defaultTo('enemy', props.fraction)
    const isEnemyBug = fraction === 'enemy'
    const isPlayerBug = !isEnemyBug

    return {
      [obsDispEvents.OBS_CREATE]: ObsDispCreate.useObs((obs) => {
        state.obs = obs
        state.bug = createMttrGameObj({
          scene,
          texture: getBugTexture(props),
          name: getBugName(props),
          isCircle: true,
          physicsProps: {
            radius: getRadius(props),
          },
        })
          .setPosition(props.pos.x, props.pos.y)
          .setCollisionCategory(COLLISION_CATEGORY.Enemy)
          .setCollidesWith([
            COLLISION_CATEGORY.Enemy,
            COLLISION_CATEGORY.Player,
            COLLISION_CATEGORY.PlayerProjectile,
          ])
          .setOnCollideActive((collision: ICollisionPair) => {
            if (!Global.isEvery30thFrame) return

            const bodyNames = getCollBodyNames(collision)
            if (
              (isEnemyBug && bodyNames.includes('bug-player')) ||
              (isPlayerBug && bodyNames.includes('bug-enemy'))
            ) {
              state.hp -= START_HP / 5 // TODO:LATER:CONFIG - current hit power
              if (state.hp <= 0) {
                ODAPI.removeObs(obs)
                isEnemyBug &&
                  dispatchEvent(events.LD_ENEMY_BUG_KILLED, { payload: { bugProps: props } })
              }
            }
          })

        applyEffect(props, state.bug)
      }),
      [sceneEvents.UPDATE]: () => {
        if (!state.bug) return

        if (isEnemyBug) {
          const closestObj = findClosestOf({ x: state.bug.x, y: state.bug.y }, scene, [
            'bug-player',
            'earth',
          ]) as IMatterImageFixed | null

          // const earthIsClosest = true
          // const playerBugIsClosest = false

          if (closestObj) {
            // // move to Earth
            // const earthPos = { x: Global.earthPos.x, y: Global.earthPos.x }
            // const velo = velocityToTarget(getObjPos(state.bug), earthPos, SPEED)
            const velo = velocityToTarget(getObjPos(state.bug), closestObj, SPEED)
            const angle = getAngleFromVelocity(velo)
            state.bug.setVelocity(velo.x, velo.y).setAngle(angle)
          }
        } else if (isPlayerBug) {
          ///
          if (Global.isUnsummoning) {
          }
          ///

          const closestObj = findClosestOf({ x: state.bug.x, y: state.bug.y }, scene, [
            'bug-enemy',
          ]) as IMatterImageFixed | null

          // const earthIsClosest = true
          // const playerBugIsClosest = false

          if (closestObj) {
            // // move to Earth
            // const earthPos = { x: Global.earthPos.x, y: Global.earthPos.x }
            // const velo = velocityToTarget(getObjPos(state.bug), earthPos, SPEED)
            const velo = velocityToTarget(getObjPos(state.bug), closestObj, SPEED)
            const angle = getAngleFromVelocity(velo)
            state.bug.setVelocity(velo.x, velo.y).setAngle(angle)
          }
        }
      },
      [events.LD_DO_UNSUMMON]: (ev) => {
        const { x, y } = ev.payload
        if (isPlayerBug && Phaser.Math.Distance.Between(state.bug.x, state.bug.y, x, y) < 300) {
          state.obs && removeObs(state.obs)

          // RESTORE HP FOR THE BUG REMOVED
          dispatchEvent(events.LD_EARTH_INCREASE_HP, { payload: { hpIncrement: 1 } })
        }
      },
      [events.LD_REPROD_ME]: (ev) => {
        if (!state.obs) return

        const c = ev.payload.bugWaveConfig as IBugWaveConfig

        const newGeneration = repeat(null, c.reprodSpawnCount).map(() => {
          const bug = createBugForWave({ x: state.bug.x, y: state.bug.y }, c)
          dispatchEvent(events.LD_BUG_REPRODUCED, { payload: { bug } })

          return bug
        })

        // 2
        state.obs && removeObs(state.obs)
      },
      [obsDispEvents.OBS_REMOVE]: () => {
        MatterObjActions.destroyAll([state.bug])
        state.bug = null
        state.obs = null
      },
    }
  },
  {
    name: 'bug',
  }
)

const getBugTexture = (props: Parameters<typeof createBug>[0]) => {
  return basedOn({
    small: always(TEXTURES_MAP.BUG_SMALL),
    big: always(TEXTURES_MAP.BUG_BIG),
    large: always(TEXTURES_MAP.BUG_BIG),
  })(props.type) as any
}

const getBugName = (props: Parameters<typeof createBug>[0]) => {
  return basedOn({
    enemy: () => 'bug-enemy',
    player: () => 'bug-player',
  })(defaultFraction(props)) as any as string
}

const getRadius = (props: Parameters<typeof createBug>[0]) => {
  return basedOn({
    small: always(20),
    big: always(50),
    large: always(100),
  })(props.type) as any
}

const defaultFraction = (props: Parameters<typeof createBug>[0]) =>
  defaultTo('enemy', props.fraction)

const applyEffect = (props: Parameters<typeof createBug>[0], bug: MatterImage) => {
  return basedOn({
    enemy: () => bug.setTintFill(0xff0000), // TOO HEAVY : bug.postFX.addGlow(0xff0000, 0.2, 1, false, 0.1, 20),
    player: () => bug.setTintFill(0x008200),
  })(defaultFraction(props)) as any
}
