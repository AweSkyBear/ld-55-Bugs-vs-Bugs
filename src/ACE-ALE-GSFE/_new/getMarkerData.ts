import { TCanvasEntity } from './canvasEntity'
import { TCanvasMarker } from '../common/types'

export const getMarkerData = (marker: TCanvasMarker) => marker.data?.getAll() as TCanvasEntity
