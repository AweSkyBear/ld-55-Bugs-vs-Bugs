import { TCanvasEntity } from './canvasEntity'
import { getODAPI } from './createEditor'
import { events } from './events'

export const updateEntityGUIField = (
  propOrPath: string,
  value: any,
  dataObjRef: TCanvasEntity,
  marker: any
) => {
  getODAPI().dispatchEvent(events.USE_ENTITY_GUI_UPDATE, {
    payload: { propOrPath, value, dataObjRef, marker },
  })
}
