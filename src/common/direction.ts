import { useDebugConstant } from './debug'
import { MatterImage, Point } from './types'

export const velocityToTarget = (from: Point, to: Point, speed: number = 0.00016): Point => {
  if (!from || !to) return { x: 0, y: 0 }

  const _speed = useDebugConstant('velToTarget_speed', speed)
  const direction = Math.atan((to.x - from.x) / (to.y - from.y))
  const speed2 = to.y >= from.y ? _speed : -_speed

  return { x: speed2 * Math.sin(direction), y: speed2 * Math.cos(direction) }
}

// taken from Phaser3's source
export const velocityFromAngle = (angle: number, speed: number) => {
  if (speed === undefined) {
    speed = 60
  }
  const vec2 = new Phaser.Math.Vector2()

  return vec2.setToPolar(angle * Phaser.Math.DEG_TO_RAD, speed)
}

export const angleBetweenPoints = (p1: Point, p2: Point) => {
  return Phaser.Math.Angle.BetweenPoints(p1, p2) * Phaser.Math.RAD_TO_DEG
}

/** Effectively the same as velocityToTarget (but slower?) */
export const velocityBetweenAngleFromPoints = (p1: Point, p2: Point, speed: number) => {
  return velocityFromAngle(angleBetweenPoints(p1, p2), speed)
}

export const getAngleFromVelocity = (vec: Point, subtractDeg: number = 90) => {
  const angle = Math.atan2(vec.y, vec.x) + Math.PI / 2
  const normalized =
    (angle > 0 ? angle : Phaser.Math.PI2 + angle) * Phaser.Math.RAD_TO_DEG - subtractDeg
  return normalized
}

export const setAngleFromVelocity = (matterImg: MatterImage, veloOverride?: Point) => {
  const velocity = veloOverride || matterImg.body.velocity
  const newAngle = getAngleFromVelocity(velocity)
  matterImg.setAngle(newAngle)
  return newAngle
}
