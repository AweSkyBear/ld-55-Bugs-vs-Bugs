import { getSelectedMarker } from './global/selectedMarker'
import { getEditorInstance } from './global/editorInstance'
import { getEntityByMarker, removeEntity } from './entityStore'

export const removeSelectedMarkerEntity = () => {
  const marker = getSelectedMarker()
  const entity = getEntityByMarker(marker)

  if (entity) {
    console.log('>>>> entity removed', entity)
    removeEntity(getEntityByMarker(marker))
    getEditorInstance().onEntityRemove(entity, marker)
  }
}
