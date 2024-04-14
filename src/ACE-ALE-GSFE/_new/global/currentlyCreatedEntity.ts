import { exposeToWindow } from '~/common/debug'
import { TCanvasEntity } from '../canvasEntity'

let _currentlyCreatedEntity: TCanvasEntity = null

export const getCurrentlyCreatedEntity = () => _currentlyCreatedEntity
export const setCurrentlyCreatedEntity = (entity: TCanvasEntity | null) =>
  (_currentlyCreatedEntity = entity)

exposeToWindow({ getCurrentlyCreatedEntity })
