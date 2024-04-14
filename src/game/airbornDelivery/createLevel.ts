import { IObserver, addObsDisp, dispatchEvent, obsDispEvents, payloadProp } from '~/OD'
import { TileSprite } from '~/common/types'
import { sceneEvents } from '~/events/sceneEvents'
import { TEXTURES_MAP } from '~/textures/textures'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { gameEvents } from '~/events/gameEvents'
import { IMatterImageFixed, IMatterSpriteFixed, MatterObjActions } from '~/common/matter'
import { LEVEL_EDITOR_INDEX, LevelEditor, Levels, TLevel, TLevelGround } from './levels/levels'
import { createMttrGameObj } from '~/core/createMttrGameObj'
import { OBJECT_NAMES } from '~/game/airbornDelivery/const/ObjectNames'
import { COLLISION_CATEGORY } from '~/game/airbornDelivery/const/CollisionsCategory'
import { Plane } from './const/Plane'
import { exposeToWindow } from '~/common/debug'
import { isDefined } from '~/common/func'
import { getRelativeScale } from '~/common/screen'

export const createLevel = () => {
  const observers: IObserver[] = []
  const scene = ObservableScenes.game

  const state = {
    levelConfig: Levels[0] as TLevel,
    elements: [] as (any | TileSprite | IMatterImageFixed | IMatterSpriteFixed)[],
    flags: [] as (IMatterImageFixed | IMatterSpriteFixed)[],
  }

  return addObsDisp(
    {
      [obsDispEvents.OBS_CREATE]: ({ payload: {} }) => {
        // todo? child observers?
      },
      [gameEvents.LEVEL_SET_LEVEL]: (ev) => {
        const index = payloadProp<number>('index')(ev)
        state.levelConfig = index === LEVEL_EDITOR_INDEX ? LevelEditor : Levels[index]
      },
      [gameEvents.GAME_START]: () => {
        ////// LD::::BUG FIX -> AHOC BUG FIX .... PRETTY SUCKY
        ObservableScenes.game.matter
          .getMatterBodies()
          .map((b) => ObservableScenes.game.matter.world.remove(b))
        //////////////////////////////////////////////////////////////

        //console.log('state.levelConfig', state.levelConfig)
        const isFromEditor = state.levelConfig.isFromEditor
        state.elements = state.levelConfig.ground.map((g) => createGroundEl(g, isFromEditor))
        setTimeout(() => {
          state.elements
            .filter((el) => el.name === OBJECT_NAMES.GROUND)
            .forEach((g, ind) => {
              g.setAngle(state.levelConfig.ground[ind].angle || 0)
            })
        })
        const flags = state.levelConfig.ground
          .map((g) => createFlagsForGround(g, isFromEditor))
          .filter(isDefined)
        state.flags = flags
        state.elements.push(...flags)

        const { ejectAreaObjs, tileSprites } = createEjectAreas(state.levelConfig)
        exposeToWindow({ ejectAreaObjs, tileSprites })
        state.elements.push(...ejectAreaObjs, ...(tileSprites as any))

        dispatchEvent('GROUND_FLAGS_CREATED', { payload: { flags: state.flags } })
      },
      // TODO:LD:GAME_LEVEL_SET
      [sceneEvents.UPDATE]: () => {
        // TODO:LD:CONTINUE -> if-cam-is-close-to-any-flag -> make this flag greener until distance is less than 100px (e.g)
        //// then wait for the CRATE to stop -> when it's stopped OR it's been GREEN for 3 seconds -> WIN

        exposeToWindow({ ground: state.elements })
        // if (_state.keySpace && scene.input.keyboard.checkDown(_state.keySpace, 500)) {
        //   _state.isPaused = !_state.isPaused
        //   _state.isPaused ? GameFlow.pauseGame() : GameFlow.resumeGame()
        //   debugLog('PAUSED')
        // }
      },
      // TODO:LD: screen go to
      GAME_RESTART: () => {
        // TODO:API - syntax like   GAME_RESTART: 'GAME_WON'
        ObservableScenes.game.matter
          .getMatterBodies()
          .map((b) => ObservableScenes.game.matter.world.remove(b))

        MatterObjActions.destroyAll(state.elements)
        state.elements = []
        state.flags = []
      },
      GAME_WON: () => {
        // BUG FIX: CLEANUP OF BODIES -// check if needed still (after doing same in GAME_START)
        ObservableScenes.game.matter
          .getMatterBodies()
          .map((b) => ObservableScenes.game.matter.world.remove(b))

        MatterObjActions.destroyAll(state.elements)
        state.elements = []
        state.flags = []
        // GlobalObservers.removeMultipleObs(observers)
        // _state.keySpace?.destroy()
        // _state.keySpace = null
      },
      [obsDispEvents.OBS_REMOVE]: () => {
        MatterObjActions.destroyAll(state.elements)
        state.elements = []
        state.flags = []
        // GlobalObservers.removeMultipleObs(observers)
        // _state.keySpace?.destroy()
        // _state.keySpace = null
      },
    },
    { id: 'createLevel' }
  )
}

const _getGroundPos = (ground: TLevelGround) => ({
  x: ground.pos.x + Plane.initialPos.x,
  y: ground.pos.y + 6000,
})
const createGroundEl = (ground: TLevelGround, isFromEditor: boolean = false) => {
  return (
    createMttrGameObj<IMatterImageFixed>({
      scene: ObservableScenes.game,
      isSprite: true,

      // TODO:REFACTOR: move the `name` inside HAGObjectProps?
      name: OBJECT_NAMES.GROUND,
      pos: ground.pos,
      texture: ground.texture,
      physicsProps: {
        frictionAir: 0,
        gravity: 10,
      },
    })
      .setName(OBJECT_NAMES.GROUND)
      .setCollisionCategory(COLLISION_CATEGORY.Ground)
      .setCollidesWith([COLLISION_CATEGORY.Player])
      // TODO:LD:relative to the WATER !
      .setPosition(
        isFromEditor ? ground.pos.x : _getGroundPos(ground).x,
        isFromEditor ? ground.pos.y : _getGroundPos(ground).y
      )
      .setStatic(true)
  )
}

const createFlagsForGround = (ground: TLevelGround, isFromEditor) => {
  if (!ground.withFlag) return

  return (
    createMttrGameObj<IMatterImageFixed>({
      scene: ObservableScenes.game,
      isSprite: true,

      // TODO:REFACTOR: move the `name` inside HAGObjectProps?
      name: OBJECT_NAMES.FLAG,
      pos: ground.pos,
      texture: TEXTURES_MAP.FLAG,
      physicsProps: {
        frictionAir: 0,
        gravity: 10,
      },
    })
      .setCollisionCategory(COLLISION_CATEGORY.Ground)
      .setSensor(true)
      .setCollidesWith([COLLISION_CATEGORY.Player])
      // note: same pos AS the flag !
      .setPosition(
        isFromEditor ? ground.pos.x : _getGroundPos(ground).x,
        (isFromEditor ? ground.pos.y : _getGroundPos(ground).y) - 90
      )
      .setStatic(true)
      .setTint(0xff5555)
      .setAngle(ground.angle || 0)
  )
}

const createEjectAreas = (level: TLevel) => {
  //console.log('levelAreas', level.ejectAreas)
  const tileSprites = level.ejectAreas.map((ejectArea) => {
    return ObservableScenes.game.add
      .tileSprite(ejectArea.x, ejectArea.y - 48 * 2, null, null, TEXTURES_MAP.EJECT_AREA)
      .setScale(getRelativeScale(1))
      .setAngle(ejectArea.angle || 0)
      .setSize(ejectArea.w, ejectArea.h)
      .setAlpha(0.2)
  })

  const ejectAreaObjs = level.ejectAreas.map((ejectArea) =>
    createMttrGameObj<IMatterImageFixed>({
      scene: ObservableScenes.game,
      isSprite: true,

      // TODO:REFACTOR: move the `name` inside HAGObjectProps?
      name: OBJECT_NAMES.EJECT_AREA,
      pos: { x: ejectArea.x, y: ejectArea.y },
      texture: TEXTURES_MAP.NO_TEXTURE,
      physicsProps: {
        frictionAir: 0,
        gravity: 10,
        rectangleSize: { width: ejectArea.w, height: ejectArea.h },
      },
    })
      .setCollisionCategory(COLLISION_CATEGORY.EjectArea)
      .setCollidesWith([COLLISION_CATEGORY.Player])
      .setSensor(true)
      .setStatic(true)
      //
      .setPosition(ejectArea.x, ejectArea.y - 90)
      .setAngle(ejectArea.angle)
  )

  return {
    tileSprites,
    ejectAreaObjs,
  }
}
