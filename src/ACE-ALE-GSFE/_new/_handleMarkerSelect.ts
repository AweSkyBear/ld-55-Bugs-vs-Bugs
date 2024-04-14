// import { hideEntityGui, showEntityGUI } from '../controls/entity/showEntityGUI'
// import { TCanvasMarker } from '../common/types'
// import { MARKER } from './canvasMarker'
// import { TCanvasEntity } from './canvasEntity'
// import { handleEntityGUIDataChange } from './handleEntityGUIDataChange'
// import { getSelectedMarker, setSelectedMarker } from './global/selectedMarker'
// import { updateMarkerData } from './updateMarkerData'

// export const handleMarkerSelect = (marker: TCanvasMarker, updatedPos?: { x; y }) => {
//   handleMarkerUnselect()
//   setSelectedMarker(marker)

//   getSelectedMarker().fillColor = MARKER.SELECT_COLOR

//   // updateEntityData(marker.data.getAll() as TCanvasEntity)

//   console.log('>>>>>>>> EDITING ENTITY MARKER ', marker.data?.getAll() as TCanvasEntity)
//   if (updatedPos) {
//     updateMarkerData(marker, { editorProps: { ...updatedPos } })
//   }

//   // showEntityGUI(
//   //   marker.data.getAll() as TCanvasEntity,
//   //   handleEntityGUIDataChange(getSelectedMarker())
//   // )
// }

// export const handleMarkerUnselect = () => {
//   // removeSelectedMarkerEntity()

//   getSelectedMarker() && (getSelectedMarker().fillColor = MARKER.DEF_COLOR)

//   setSelectedMarker(null)

//   hideEntityGui()
// }
