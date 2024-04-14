import Prando from 'prando'
import { Point } from './types'
import { Global } from '~/LD55/global/global'

export const getGamePrando = () => new Prando('bugs-vs-bugs')

// export const getNextRandomIntPos = (outsideOf: Point, dist: number) => {
//   return {
//     x: _prand.nextInt((outsideOf.x + dist) * (_prand.nextBoolean() ? 1 : -1)),
//     y: _prand.nextInt(),
//   }
// }
