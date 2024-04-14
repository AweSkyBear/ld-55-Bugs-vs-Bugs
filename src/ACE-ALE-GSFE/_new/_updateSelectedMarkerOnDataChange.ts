import { TCanvasEntity } from './canvasEntity'
import { mergeEntityData } from './mergeEntityData'
import { getSelectedMarker } from './global/selectedMarker'

// TODO:ALE:1 - use it?
export const updateSelectedMarkerOnDataChange = (data: TCanvasEntity, keyOrPathChanged: string) => {
  // getSelectedMarker().setData(mergeEntityData(getSelectedMarker().data.getAll(), data))

  if (keyOrPathChanged.includes('x') || keyOrPathChanged.includes('y')) {
    getSelectedMarker().x = data.editorProps.x
    getSelectedMarker().y = data.editorProps.y
  }
}
