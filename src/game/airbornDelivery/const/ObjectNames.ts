import { exposeToWindow } from '~/common/debug'

export const OBJECT_NAMES = {
  PLANE: 'PLANE',
  CRATE: 'CRATE',
  GROUND: 'GROUND',
  FLAG: 'FLAG',
  CRATE_WOOD: 'CRATE_WOOD',
  CRATE_IRON: 'CRATE_IRON',
  EJECT_AREA: 'EJECT_AREA',
}

exposeToWindow({ OBJECT_NAMES })

export const ObjectFields = {
  baseProps: {
    hp: 'hp',
    touchDamage: 'touchDamage',
  },
}
