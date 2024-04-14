import { Easing, MatterImage, Point, PointLight, Tween } from '~/common/types'
import { obsDispCreator, obsDispEvents } from '../OD'
import { createMttrGameObj } from '~/core/createMttrGameObj'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { COLLISION_CATEGORY } from '~/game/airbornDelivery/const/CollisionsCategory'
import { TEXTURES_MAP } from '~/textures/textures'
import { MatterObjActions } from '~/common/matter'

export const createSummoningCircle = obsDispCreator<{
  pos: Point
  radius: number
}>(
  ({ pos, radius } = {} as any) => {
    const scene = ObservableScenes.game
    const state = {
      // projectile: null as MatterImage,
      light: null as PointLight,
      tweenLife: null as Tween,
    }

    return {
      [obsDispEvents.OBS_CREATE]: () => {
        // state.projectile = createMttrGameObj({
        //   scene,
        //   name: 'projectile',
        //   pos,
        //   texture: TEXTURES_MAP.NO_TEXTURE,
        // })
        //   .setBody({ type: 'circle', addToWorld: true, radius }, { label: 'projectile' })
        //   .setCollisionCategory(COLLISION_CATEGORY.PlayerProjectile)
        //   .setCollidesWith(COLLISION_CATEGORY.Enemy)
        //   .setSensor(true)

        const initialRadius = radius
        const scaleFrom = 1.5 + 0.5 * Math.random()
        state.light = scene.add.pointlight(pos.x, pos.y, 0x0f0f, radius * scaleFrom, 1, 0.5)

        state.tweenLife?.destroy()
        state.tweenLife = scene.add.tween({
          targets: [state.light],
          radius: { from: 2 * initialRadius, to: 1, step: 0.5 },
          ease: Easing.Elastic.Out,
          // ease: Easing.Elastic.InOut,
          duration: 2200, // 1200
          yoyo: true,
          onComplete: () => {
            // TODO:NOW destr it
            state.light && (state.light.alpha = 0)
          },
        })
      },
      [obsDispEvents.OBS_REMOVE]: () => {
        MatterObjActions.destroyAll([state.light])
        // state.projectile = null
        state.light = null
      },
    }
  },
  { name: 'summon-circle' }
)
