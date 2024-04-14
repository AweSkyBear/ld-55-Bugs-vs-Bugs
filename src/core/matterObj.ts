import { Vector } from 'matter'
import { compose, defaultTo, path, pathOr, pick, prop } from 'ramda'
import { mainCam } from '~/common/camera'
import { MatterObjActions } from '~/common/matter'
import { getScreenDprHeight } from '~/common/screen'
import {
  GameObject,
  ICollisionData,
  ICollisionPair,
  MatterBody,
  MatterImage,
  Point,
} from '~/common/types'

export const DEFAULT_PHYS_PROPS = {
  mass: 1,
  scale: 1,
  // NORMAL ::: normal defaults
  friction: 0.2,
  frictionAir: 0.1,
  frictionStatic: 0.2,
  bounce: 0.5,
  ignoreGravity: false,
  gravity: 3,
  timeScale: 1,
  /** If enemy and If force is to be applied every step */
  followSpeed: 0.00016,
  rectangleSize: null as any as { width: number; height: number },
  radius: 50,
}

export type TPhysicsProps = Partial<typeof DEFAULT_PHYS_PROPS>

export const clampVelocity = (obj: MatterImage, maxVel: Point) => {
  // this does:
  // state.crate.body.velocity.x = Math.min(ObjectSpeed.SLOW_X50, state.crate.body.velocity.x)
  // state.crate.body.velocity.y = Math.min(ObjectSpeed.SLOW_X50, state.crate.body.velocity.y)

  // doesn't work:
  const velocity = pathOr<Phaser.Math.Vector2 | null>(null, ['body', 'velocity'], obj)
  if (!velocity) return

  if (velocity.x > maxVel.x) obj.setVelocityX(maxVel.x)
  if (velocity.y > maxVel.y) obj.setVelocityX(maxVel.y)
}

export const clampAngularVelocity = (obj: MatterImage, maxAbsValue: number) => {
  const angVel = path<number>(['angularVelocity'], obj.body)
  if (Math.abs(angVel) > maxAbsValue) {
    obj.setAngularVelocity(Math.sign(angVel) * maxAbsValue)
  }
}

/** TODO: instead use PositionGetters.getPosition */
export const getPositionFromXY = (obj: GameObject) =>
  defaultTo({ x: -1, y: -1 }, obj.body && pick(['x', 'y'], obj)) as Point

export const getPosition = pathOr<Vector>({ x: -1, y: -1 }, ['position'])
export const getBody = path<MatterImage['body']>(['body'])

export const getBodyVelocity = (body: MatterBody) => {
  const velocity = {
    x: body.position.x - body.positionPrev.x,
    y: body.position.y - body.positionPrev.y,
  }
  return velocity
}
/**
 * Technically, simply the greatest difference between every point (boundary
 * of the body) - does not need be a circle */
export const getBodyDiameter = (body: MatterBody) => {
  const diameter = Math.max(
    body.bounds.max.x - body.bounds.min.x,
    body.bounds.max.y - body.bounds.min.y
  )
  return diameter
}
/**
 * Does the main camera see the objects?
 * Also returns the removed objects */
export const destroyIfNotVisibleOnScreen = (gos: MatterImage[]) => {
  if (gos.length > 0) {
    const visibleOnes = mainCam(gos[0].scene)!.cull(gos)
    const offScreensGos = gos.filter((b) => b.y > getScreenDprHeight() && !visibleOnes.includes(b))
    MatterObjActions.destroyAll(offScreensGos)
    return offScreensGos
  } else {
    return []
  }
}

const _getCollBodyLabel = path(['label'])
export const getCollBodyNames = (collPair: ICollisionPair) => {
  return [_getCollBodyLabel(collPair.bodyA), _getCollBodyLabel(collPair.bodyB)]
}
