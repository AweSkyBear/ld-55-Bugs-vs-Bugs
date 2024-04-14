import { TEXTURES_MAP } from '~/textures/textures'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { getRelativeScale } from '~/common/screen'
import { exposeToWindow } from '~/common/debug'

export const createEjectAreaEl = (x, y, w, h, angle) => {
  const el = ObservableScenes.game.add
    .tileSprite(
      x,
      y - 48 * 2,
      w, // was null
      h, // was null
      TEXTURES_MAP.EJECT_AREA
    )
    .setScale(getRelativeScale(1))
    .setAngle(angle || 0)
    // .setSize(w, h) // was on
    .setAlpha(0.2)
  //console.log('levelAreas', level.ejectAreas)
  exposeToWindow({ el })
  return el
}
