import { TCanvasMarker } from '../common/types'
import { getEditorInstance } from './global/editorInstance'
import { TCanvasEntity } from './canvasEntity'
import { addEntity } from './entityStore'

export const createEntityFromFunctionForMarker = (marker: TCanvasMarker) => {
  const data = marker.data.getAll() as TCanvasEntity

  const funcToRun = getEditorInstance().entityFunctions[data.functionName]
  const newEntity = funcToRun(...Object.values(data.editorProps))

  addEntity(newEntity, marker)

  return newEntity
}

export const markerHasAssignedFunction = (marker: TCanvasMarker) =>
  Boolean(marker.data.get('functionName'))
