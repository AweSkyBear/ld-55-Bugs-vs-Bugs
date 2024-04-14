import { addObsDisp, obsDispEvents } from '~/OD'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { IMatterSpriteFixed, MatterObjActions } from '~/common/matter'
import { TLevelGround } from '../levels/levels'
import { Image } from '~/common/types'

export const createGroundEl = (x, y, angle, texture, withFlag) => {
  console.log('GROuND ARGS  x, y, angle, texture, withFlag', x, y, angle, texture, withFlag)
  const state = {
    groundEl: null as Image | IMatterSpriteFixed,
  }

  return addObsDisp({
    [obsDispEvents.OBS_CREATE]: ({ payload: {} }) => {
      // todo? child observers?
      console.log('>>> createGroundEl: CREATING groundEL: ', {
        pos: { x, y },
        angle,
        withFlag,
        texture,
      })
      state.groundEl = _createGroundEl({ pos: { x, y }, angle, withFlag, texture })
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      MatterObjActions.destroyAll([state.groundEl])
      state.groundEl = null
    },
  })
}

const _getGroundPos = (ground: TLevelGround) => ({
  x: ground.pos.x, //+ Plane.initialPos.x,
  y: ground.pos.y, //+ 6000,
})
const _createGroundEl = (ground: TLevelGround) => {
  console.log('_createGroundEl', ground)

  const el = ObservableScenes.game.add.image(ground.pos.x, ground.pos.y, ground.texture)
  el.setAngle(ground.angle || 0)
  // ({
  //   scene: ObservableScenes.game,
  //   isSprite: true,

  //   // TODO:REFACTOR: move the `name` inside HAGObjectProps?
  //   name: OBJECT_NAMES.GROUND,
  //   pos: ground.pos,
  //   texture: ground.texture,
  //   physicsProps: {
  //     frictionAir: 0,
  //     gravity: 10,
  //   },
  // })
  //   .setAngle(ground.angle || 0)
  //   .setName(OBJECT_NAMES.GROUND)
  //   .setCollisionCategory(COLLISION_CATEGORY.Ground)
  //   .setCollidesWith([COLLISION_CATEGORY.Player])
  //   // TODO:LD:relative to the WATER !
  //   .setPosition(_getGroundPos(ground).x, _getGroundPos(ground).y)
  //   .setStatic(true)

  ground.withFlag && el.setTint(0x00ff99)
  return el

  // const el = createMttrGameObj<IMatterImageFixed>({
  //   scene: ObservableScenes.game,
  //   isSprite: true,

  //   // TODO:REFACTOR: move the `name` inside HAGObjectProps?
  //   name: OBJECT_NAMES.GROUND,
  //   pos: ground.pos,
  //   texture: ground.texture,
  //   physicsProps: {
  //     frictionAir: 0,
  //     gravity: 10,
  //   },
  // })
  //   .setAngle(ground.angle || 0)
  //   .setName(OBJECT_NAMES.GROUND)
  //   .setCollisionCategory(COLLISION_CATEGORY.Ground)
  //   .setCollidesWith([COLLISION_CATEGORY.Player])
  //   // TODO:LD:relative to the WATER !
  //   .setPosition(_getGroundPos(ground).x, _getGroundPos(ground).y)
  //   .setStatic(true)

  // ground.withFlag && el.setTint(0x00ff99)
  // return el
}
