import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { getCamScrollPos } from './camera'
import { addPoints } from './func'
import { Point } from './types'

export const pointerPosWithCamScroll = () =>
  addPoints(
    ObservableScenes.game.input.activePointer.position,
    getCamScrollPos(ObservableScenes.game)
  )

export const getAngleBetweenWorldPointerPosAnd = (point: Point, angleToAdd = 0) => {
  const pointerWithCamScroll = pointerPosWithCamScroll()
  const angle =
    Phaser.Math.Angle.BetweenPoints(point, pointerWithCamScroll) * Phaser.Math.RAD_TO_DEG +
    angleToAdd
  return angle
}
