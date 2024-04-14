import { defaultTo } from 'ramda'
import { IMatterSpriteFixed } from '~/common/matter'

let _plane: IMatterSpriteFixed = null
export const setPlane = (plane: IMatterSpriteFixed) => {
  _plane = plane
}

export const getPlane = () => defaultTo({} as IMatterSpriteFixed, _plane)
