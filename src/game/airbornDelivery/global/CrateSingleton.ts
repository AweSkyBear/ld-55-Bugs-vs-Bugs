import { IMatterSpriteFixed } from '~/common/matter'

let _crate: IMatterSpriteFixed = null
export const setCrate = (crate: IMatterSpriteFixed) => {
  _crate = crate
}

export const getCrate = () => _crate?.body && _crate
