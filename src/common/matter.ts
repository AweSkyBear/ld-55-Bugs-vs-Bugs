import {
  all,
  any,
  compose,
  defaultTo,
  either,
  equals,
  path,
  pathEq,
  prop,
  propEq,
  propOr,
  asArray,
  isDefined,
  multiplyPoint,
} from './func'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { exposeToWindow, useDebugConstant } from './debug'
import {
  Func,
  GameObject,
  ICollisionPair,
  MatterBody,
  MatterImage,
  MatterSprite,
  MatterWorldConfig,
  Point,
  Scene,
  Vector,
  Vector2,
} from './types'

export interface IMatterWorldConfig extends MatterWorldConfig {
  customGravity?: Vector
}

// export interface IMatterObjFixed<T extends MatterSprite | MatterImage>
// {
//   setMass: Func<number, T>
//   setBounce: Func<number, T>
//   setIgnoreGravity: Func<boolean, T>
//   setVelocity: (x: number, y: number) => T
//   setAngularVelocity: Func<number, T>
//   setPosition: (x: number, y: number) => T
//   setSensor: Func<boolean, T>
//   setCollidesWith: (categories: number | number[]) => T
//   setCollisionCategory: Func<number, T>
//   setStatic: Func<boolean, T>
//   setName: Func<string, T>
//   setCircle: (
//     radius: number,
//     options?: Phaser.Types.Physics.Matter.MatterBodyConfig
//   ) => T
//   setRectangle: (
//     width: number,
//     height: number,
//     options?: Phaser.Types.Physics.Matter.MatterBodyConfig
//   ) => T
//   setOnCollide: (callback: Function) => T
//   setBody: (
//     config: string | Phaser.Types.Physics.Matter.MatterSetBodyConfig,
//     options?: Phaser.Types.Physics.Matter.MatterBodyConfig
//   ) => T
//   play: (
//     key: string | Phaser.Animations.Animation | Phaser.Types.Animations.PlayAnimationConfig,
//     ignoreIfPlaying?: boolean
//   ) => T
//   setFriction: (value: number, air?: number, fstatic?: number) => T
//   setFrictionStatic: Func<number, T>,
//   setFrictionAir: Func<number, T>,
// }

export type IMatterObj = IMatterSpriteFixed | IMatterImageFixed

// @ts-ignore
export interface IMatterSpriteFixed extends MatterSprite {
  setMass: Func<number, IMatterSpriteFixed>
  setBounce: Func<number, IMatterSpriteFixed>
  setIgnoreGravity: Func<boolean, IMatterSpriteFixed>
  setVelocity: (x: number, y: number) => IMatterSpriteFixed
  setAngularVelocity: Func<number, IMatterSpriteFixed>
  setFriction: Func<number, IMatterSpriteFixed>
  setFrictionStatic: Func<number, IMatterSpriteFixed>
  setFrictionAir: Func<number, IMatterSpriteFixed>
  setPosition: (x: number, y: number) => IMatterSpriteFixed
  setSensor: Func<boolean, IMatterSpriteFixed>
  setCollidesWith: (categories: number | number[]) => IMatterSpriteFixed
  setCollisionCategory: Func<number, IMatterSpriteFixed>
  setStatic: Func<boolean, IMatterSpriteFixed>
  setInteractive: Func<
    [hitArea?: any, callback?: Phaser.Types.Input.HitAreaCallback, dropZone?: boolean],
    IMatterSpriteFixed
  >
  setName: Func<string, IMatterSpriteFixed>
  setCircle: (
    radius: number,
    options?: Phaser.Types.Physics.Matter.MatterBodyConfig
  ) => IMatterSpriteFixed
  setRectangle: (
    width: number,
    height: number,
    options?: Phaser.Types.Physics.Matter.MatterBodyConfig
  ) => IMatterSpriteFixed
  setOnCollide: (callback: Function) => IMatterSpriteFixed
  setBody: (
    config: string | Phaser.Types.Physics.Matter.MatterSetBodyConfig,
    options?: Phaser.Types.Physics.Matter.MatterBodyConfig
  ) => IMatterSpriteFixed
  play: (
    key: string | Phaser.Animations.Animation | Phaser.Types.Animations.PlayAnimationConfig,
    ignoreIfPlaying?: boolean
  ) => IMatterSpriteFixed
}

// @ts-ignore
export interface IMatterImageFixed extends MatterImage {
  setMass: Func<number, IMatterImageFixed>
  setIgnoreGravity: Func<boolean, IMatterImageFixed>
  setFriction: (value: number, air?: number, fstatic?: number) => IMatterImageFixed
  setFrictionStatic: Func<number, IMatterImageFixed>
  setFrictionAir: Func<number, IMatterImageFixed>
  setVelocity: (x: number, y: number) => IMatterImageFixed
  setPosition: (x: number, y: number) => IMatterImageFixed
  setSensor: Func<boolean, IMatterImageFixed>
  setStatic: Func<boolean, IMatterSpriteFixed>
  setCollidesWith: (categories: number | number[]) => IMatterImageFixed
  setOnCollide: Func<Function, IMatterImageFixed>
  setCollisionCategory: Func<number, IMatterImageFixed>
  setName: Func<string, IMatterImageFixed>

  setBody: Func<any, IMatterImageFixed>
  setInteractive: Func<
    [any, callback?: Phaser.Types.Input.HitAreaCallback, dropZone?: boolean],
    IMatterImageFixed
  >
  setAngularVelocity: Func<number, IMatterImageFixed>
  setBounce: Func<number, IMatterImageFixed>
  setCircle: (
    radius: number,
    options?: Phaser.Types.Physics.Matter.MatterBodyConfig
  ) => IMatterImageFixed
  setRectangle: (
    width: number,
    height: number,
    options?: Phaser.Types.Physics.Matter.MatterBodyConfig
  ) => IMatterSpriteFixed
}

export const getGlobalTimeScale = (scene: Scene) => scene.matter.world.engine.timing.timeScale

/** Note: need to have the .gameObject attached when creating the Matter instance */
export const getBodyBFromCollision = (collPair: any) => (collPair as any).bodyB.gameObject
export const getBodyAFromCollision = (collPair: any) => (collPair as any).bodyA.gameObject

// WORKAROUND:::
// non-existent off-screen body!

const _removeMatterPhaserObj = (matterImage: GameObject) => {
  matterImage.displayList && matterImage.removeFromDisplayList()
  matterImage.removeFromUpdateList()
  matterImage.destroy()
  matterImage.scene && matterImage.scene.matter.world.remove(matterImage)
}

exposeToWindow({ _removeMatterPhaserObj })
export const MatterObjActions = {
  isSafe: (obj: IMatterObj) => prop('body', obj),
  destroy: (matterImage: GameObject) => {
    // matterImage.scene && matterImage.scene.matter.world.remove(matterImage)
    _removeMatterPhaserObj(matterImage)
  },
  destroyAll: (matterImages: GameObject[] | GameObject[]) => {
    matterImages.forEach((o) => o && _removeMatterPhaserObj(o))
    // matterImages[0].scene && matterImages[0].scene.matter.world.remove(matterImages)
  },
  destroyBody: (body: MatterJS.BodyType) =>
    (body.gameObject?.scene || ObservableScenes.game.scene).matter.world.remove(body),
}

const ZERO = 0
export const createBodyFromPoints = (
  scene: Scene,
  _points: Point[],
  opts?: {
    pointCount?: number
    scale?: number
    bodyConfig?: { initialPos?: Point; bodyConfig?: MatterJS.IBodyDefinition }
  }
  // pointCount?: number
) => {
  const curve = new Phaser.Curves.Spline(_points as any)
  const points = curve.getPoints(defaultTo<any, any>(_points.length, prop<any>('pointCount')(opts)))

  // const rawPoints = curve.getPoints(_points.length)
  // const vertexSets = [rawPoints]

  // NOTE:ALWAYS use 0 for the x,y of the created body if will attach it to an image!!!
  //// otherwise - bug
  const newBody = scene.matter.bodies.fromVertices(
    ZERO,
    ZERO,
    // apply scaling
    [points.map((p) => multiplyPoint(p, defaultTo(1, opts?.scale)))],
    {
      angle: 0,
      isStatic: true,
      ...opts?.bodyConfig,
    }
  )
  // const newBodyRaw = scene.matter.bodies.fromVertices(ZERO, ZERO, [rawPoints], {
  //   angle: 0,
  //   isStatic: true,
  //   isSensor: true,
  // })

  return { newBody, newBodyRaw: null }
}

export const getMatterBody = (matterObj: MatterImage | MatterSprite) => {
  return matterObj.body as MatterJS.BodyType
}

const _getObjName: Func<MatterBody, string> = either(
  path(['gameObject', 'name']) as any,
  prop('label')
) as any

// export const findGameObjectByName = (...args: GameObject[]) => args.map(prop('gameObject') as any).find(propEq('name', OBJECT_NAMES.PARACHUTER))

const createBodyFinder = (objNameOrLabel: string) => compose(equals(objNameOrLabel), _getObjName)

export const findMatterObjectInCollisionEvByNameOrLabel = (
  objName: string,
  ...args: MatterJS.BodyType[]
): MatterImage | undefined => {
  const bodyFinder = createBodyFinder(objName)
  const foundBody = args.find(bodyFinder)
  return foundBody && foundBody.gameObject
}
exposeToWindow({ findMatterObjectInCollisionEvByNameOrLabel })

export const getAllMatchingObjectsInCollisionByName = (bodyA, bodyB) => (objectNames: string[]) => {
  return objectNames
    .map((objName) => findMatterObjectInCollisionEvByNameOrLabel(objName, bodyA, bodyB))
    .filter(isDefined)
    .reduce((acc, obj) => {
      acc[obj.name] = obj
      return acc
    }, {} as Record<string, GameObject>)
}

export const collisionMatchesPair = (bodyA: MatterBody, bodyB: MatterBody, objNames: string[]) => {
  const bodies = [bodyA, bodyB]
  return (
    (_getObjName(bodyA) === objNames[0] && _getObjName(bodyB) === objNames[1]) ||
    (_getObjName(bodyA) === objNames[1] && _getObjName(bodyB) === objNames[0])
  )

  return all((name) =>
    any(either(pathEq(['gameObject', 'name'], name), propEq('label', name)))(bodies)
  )(objNames)
}
export const hasAnyObjectInCollisionPair = (pair: ICollisionPair, objectNames: string[]) => {
  const result = getAllMatchingObjectsInCollisionByName(pair.bodyA, pair.bodyB)(objectNames)
  const hasOtherObject = Object.values(result).find(isDefined)
  return hasOtherObject
}

export const getMatterObjAngle = (obj: MatterImage) => {
  if (!path(['body'], obj)) return 0
  return obj.angle
}
// TODO:REFACTOR -> extract this as a higher-order function: if (!path(['body'], obj)) return 0
export const getMatterObjSpeed = (obj: MatterImage) => {
  if (!path(['body'], obj)) return 0

  const plrPrevPos = (obj.body as MatterBody).positionPrev
  const objPos = (obj.body as MatterBody).position
  return Phaser.Math.Distance.BetweenPoints(plrPrevPos, objPos)
}

export const getMatterObjAngularVelo = (obj: MatterImage) => {
  if (!path(['body'], obj)) return 0

  const angularVelocity = (obj.body as MatterBody).angularVelocity
  return angularVelocity
}

export const getMatterBodySize = (body: MatterBody) => ({
  w: body.bounds.max.x - body.bounds.min.x,
  h: body.bounds.max.y - body.bounds.min.y,
})

// TODO:
export const applyFixedTimeStep = () => {
  // console.log('preup', ...args)
  // this._deltaAccum += delta
  // if (this._deltaAccum > _60_FPS_DELTA) {
  //   this._deltaAccum -= _60_FPS_DELTA
  //   dispatchEvent(this.observable, sceneEvents.UPDATE, { time, delta })
  //   // this.matter.world.step(_60_FPS_DELTA);
  //   const timeScale = this.matter.world.engine.timing.timeScale
  //   this.matter.world.enabled && this.matter.world.step(_60_FPS_DELTA * timeScale)
  // }
}

export const applyDeltaTimeStep = () => {
  // TODO
}
