import { getSelectedMarker, setSelectedMarker } from './global/selectedMarker'
import { removeSelectedMarkerEntity } from './removeSelectedMarkerEntity'

/** Do all cleaning related to selected entity: also remove the marker (if any) */
export const handleRemoveSelectedEntity = () => {
  removeSelectedMarkerEntity()

  if (getSelectedMarker()) {
    getSelectedMarker().destroy()
    setSelectedMarker(null)
  }
}
