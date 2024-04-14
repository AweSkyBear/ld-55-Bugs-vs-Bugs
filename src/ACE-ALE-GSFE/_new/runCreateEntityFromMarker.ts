import { sendToTop } from '../common/scene'
import { TCanvasMarker } from '../common/types'
import { getEditorInstance } from './global/editorInstance'
import { createEntityFromFunctionForMarker } from './createEntityFromFunctionForMarker'

export const runCreateEntityFromMarker = (marker: TCanvasMarker) => {
  const newEntity = createEntityFromFunctionForMarker(marker)
  getEditorInstance().onEntityAdd(newEntity, marker)

  sendToTop(marker)
}
