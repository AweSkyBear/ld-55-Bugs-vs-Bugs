import { GameObject, Image, Point } from './types'

export const getObjPos = (obj: Phaser.GameObjects.Components.Transform) => {
  return {
    x: obj.x,
    y: obj.y,
  } as Point
}
