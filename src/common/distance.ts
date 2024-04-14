import { mainCam } from '~/common/camera'
import { getScreenDprHeight, getScreenDprWidth } from '~/common/screen'
import { GameObject, Image, Point, Scene } from '~/common/types'
import { pick } from '~/common/func'
import { IMatterObj } from '~/common/matter'
import { arePointsEqual } from '~/ACE-ALE-GSFE/common/func'

export const getDistanceToClosestObjFrom = (posFrom: Point, objs: (Image | IMatterObj)[]) => {
  let smallestDist = Infinity
  let closestObj = null as typeof objs[0]
  objs.forEach((o) => {
    const oPos = pick(['x', 'y'], o || {})
    const dist = Phaser.Math.Distance.BetweenPoints(oPos, posFrom)
    if (smallestDist > dist) {
      smallestDist = dist
      closestObj = o
    }
  })

  return { closestObj, smallestDist }
}

export const getDistanceToClosestObjFromCamCenter = (scene: Scene, objs: Image[]) => {
  const camMiddle = {
    x: mainCam(scene).scrollX + getScreenDprWidth() / 2,
    y: mainCam(scene).scrollY + getScreenDprHeight() / 2,
  }

  let smallestDist = Infinity
  objs.forEach((o) => {
    const oPos = pick(['x', 'y'], o)
    const dist = Phaser.Math.Distance.BetweenPoints(oPos, camMiddle)
    if (smallestDist > dist) smallestDist = dist
  })

  return smallestDist
}

/** Return the closest object of all of the ones matching the label */
export const findClosestOf = (from: Point, scene: Scene, objLabels: string[]) => {
  let closestDist = Infinity
  let closestObj: GameObject = null

  scene.children.list.forEach((ch) => {
    const matchesName = objLabels.includes(ch.name)
    const chX = (ch as any).x
    const chY = (ch as any).y
    const hasPos = chX
    const isCurrentObj = from.x === chX && from.y === chY

    if (!isCurrentObj && matchesName && hasPos) {
      const distance = Phaser.Math.Distance.Between(from.x, from.y, chX, chY)
      if (distance < closestDist) {
        closestDist = distance
        closestObj = ch
      }
    }
  })

  return closestObj
}
