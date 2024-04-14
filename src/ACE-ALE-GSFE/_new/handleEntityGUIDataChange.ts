import { TCanvasEntity } from './canvasEntity'
import { getEntityByMarker, removeEntity } from './entityStore'
import { runCreateEntityFromMarker } from './runCreateEntityFromMarker'
import { TCanvasMarker } from '../common/types'
import { getEditorInstance } from './global/editorInstance'
import { updateMarkerData } from './updateMarkerData'
import { getSelectedMarker } from './global/selectedMarker'

/** Run re-create/update of entity (also removal when needed) */
export const handleEntityGUIDataChange =
  (_marker: TCanvasMarker) => (updatedData: TCanvasEntity, keyChanged) => {
    // marker.setData(updatedData)
    const marker = getSelectedMarker() || _marker // TODO:ALE:0 --  REFACTOR THIS

    // updateMarkerData(marker, updatedData)
    // ?? update the GUI too

    if (keyChanged === 'label') {
      // nothing
    } else if (keyChanged === 'functionName') {
      console.log('functionName functionName')

      // nothing here ?
    } else {
      if (['editorProps.x', 'editorProps.y'].includes(keyChanged)) {
        // update marker
        marker.setPosition(updatedData.editorProps.x, updatedData.editorProps.y)
      }

      // if other substantial prop changed AND there is an entity for this marker
      /// -> run the onEntityUpdate -> + a mechanism for now for 'force re-create'
      const existingEntity = getEntityByMarker(getSelectedMarker())
      console.log('existing', existingEntity)

      existingEntity &&
        getEditorInstance().onEntityUpdate(existingEntity, marker, () =>
          runCreateEntityFromMarker(marker as any)
        )
    }
  }
