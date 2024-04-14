import { TCanvasEntity } from './canvasEntity'
import { mergeEntityData } from './mergeEntityData'
import { TCanvasMarker, DeepPartial } from '../common/types'

export const updateMarkerData = (marker: TCanvasMarker, data: DeepPartial<TCanvasEntity>) => {
  const existingData = marker.data?.getAll() as TCanvasEntity
  const merged = mergeEntityData(existingData, data)
  marker.setData(merged)
  return merged
}
