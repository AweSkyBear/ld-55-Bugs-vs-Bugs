import GUI from 'lil-gui'
import { CANVAS_ENTITY_PRESET, TCanvasEntity, TStoredEntity } from './canvasEntity'
import { mergeEntityData } from './mergeEntityData'
import { getODAPI } from './createEditor'
import { entityGUI } from './entityGUI'
import { events } from './events'
import { exposeToWindow } from '~/common/debug'
import { TEntityFunctions } from './types'
import { DeepPartial, TCanvasMarker } from '../common/types'
import { TEditorConfig } from '../plugEditor'
import { IEvent } from 'obs-disp'
import { omit, pick } from 'ramda'
import { getGuiDataRef, updateGuiDataRef } from './global/guiDataRef'
import { defer } from '../common/func'

export const createEntityGUI = () =>
  getODAPI().addObsDisp(() => {
    const state = {
      gui: null as GUI,
      dataObjRef: mergeEntityData(CANVAS_ENTITY_PRESET),
      entityFunctions: {} as TEntityFunctions,
      propTypes: {} as TEditorConfig['propTypes'],
      lastMarkerSelectedPayload: null as { x; y; marker },
    }

    const recreateGUI = (guiData: DeepPartial<TCanvasEntity>, marker?: TCanvasMarker) => {
      state.gui?.destroy()

      state.gui = entityGUI(
        mergeEntityData(state.dataObjRef, guiData),
        state.entityFunctions,
        marker,
        state.propTypes
      )
    }

    return {
      [events.USE_CONFIGURE]: (ev: IEvent & { payload: TEditorConfig }) => {
        state.entityFunctions = ev.payload.entityFunctions
        state.propTypes = ev.payload.propTypes
      },
      [events.USE_MARKER_SELECTED]: (ev) => {
        const { x, y, marker } = ev.payload

        //// GET entity data for the marker!
        state.lastMarkerSelectedPayload = ev.payload as any
        getODAPI().dispatchEvent(events.USE_ENTITY_REQUEST_GET_DATA, {
          payload: { intent: 'get-data-for-entity-GUI', marker },
        })

        exposeToWindow({ gui: state.gui })
      },
      [events.USE_MARKER_DRAGGED]: (ev) => {
        defer(() => {
          // kind of bad...: TODO:ALE:00000000000 - fix this / is this needed? ......
          const controllers = state.gui.controllersRecursive() // (state.gui.children[0] as GUI).controllers
          const controllerX = controllers.find((c) => c.property === 'x')
          controllerX?.setValue(ev.payload.x)
          const controllerY = controllers.find((c) => c.property === 'y')
          controllerY?.setValue(ev.payload.y)

          // const controllerY = controllers.find((c) => c.property === 'y')
          // controllerY.setValue(ev.payload.y)
        })
        // BAD BAD BAD: defer(() => recreateGUI(getGuiDataRef(), ev.payload.marker as TCanvasMarker))
      },
      [events.USE_ENTITY_RESPONSE_GET_DATA]: (ev) => {
        const { intent, storedEntity } = ev.payload as {
          intent: string
          storedEntity: TStoredEntity
        }
        if (intent === 'get-data-for-entity-GUI') {
          const { x, y, marker } = state.lastMarkerSelectedPayload

          if (storedEntity) {
            recreateGUI(storedEntity.entityData, storedEntity.marker)
          } else {
            recreateGUI({ editorProps: { x, y } }, marker)
          }
        }
      },
      [events.USE_ENTITY_GUI_REQUEST_RESET]: (ev) => {
        recreateGUI(
          mergeEntityData(state.dataObjRef, ev.payload.dataObjRef),
          state.lastMarkerSelectedPayload.marker
        )
      },
    }
  })
