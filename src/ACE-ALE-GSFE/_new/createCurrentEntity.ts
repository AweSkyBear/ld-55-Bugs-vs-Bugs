import { basedOnPartial, omit } from '~/common/func'
import { getODAPI } from './createEditor'
import { events } from './events'
import { TCanvasEntity, TStoredEntity, CANVAS_ENTITY_PRESET } from './canvasEntity'
import { createCurrentEntityFromFunction } from './createCurrentEntityFromFunction'
import { TCanvasMarker } from '../common/types'
import { exposeToWindow } from '~/common/debug'
import objectPath from 'object-path'
import { TEditorConfig } from '../plugEditor'
import { sendToTop } from '../common/scene'
import { defer } from '../common/func'
import { getGuiDataRef, updateGuiDataRef } from './global/guiDataRef'
import { getSelectedMarker } from './global/selectedMarker'
import {
  getCurrentlyCreatedEntity,
  setCurrentlyCreatedEntity,
} from './global/currentlyCreatedEntity'
import { TCanvasMarkerState } from './canvasMarker'

/** CRUD */
export const createCurrentEntity = () =>
  getODAPI().addObsDisp(() => {
    const state = {
      functions: new Map<string, Function>(),
      currentFunctionName: null as string,
      currentEntity: null as TStoredEntity['entity'],
      entityFunctions: {} as Record<any, Function>,
      /** The currently-stored entity  */
      currentStoredEntity: null as TStoredEntity,
      onEntityRemove: null as TEditorConfig['onEntityRemove'],
      _entityRecreationIsForbidden: false,
      _isCurrentlyCreatingEntity: false,
    }

    /** Workaround for multiple-times-created issue  */
    const forbidImmediateEntityRecreation = () => {
      state._entityRecreationIsForbidden = true
      return defer(() => {
        state._entityRecreationIsForbidden = false
      }, 100)
    }
    const scheduleDelayedEntityRecreation = ({ marker }) => {
      //// Request CREATE or UPDATE for the entity
      //// NOTE: defer so that all GUI updates have run
      forbidImmediateEntityRecreation().then(() => {
        getGuiDataRef().functionName &&
          getODAPI().dispatchEvent(events.USE_ENTITY_REQUEST_RECREATE_CURRENT, {
            payload: { marker, forceRecreate: true },
          })
      })
    }

    return {
      [events.USE_CONFIGURE]: (ev) => {
        state.entityFunctions = ev.payload.entityFunctions
        state.onEntityRemove = ev.payload.onEntityRemove
      },
      [events.USE_ENTITY_SELECT]: () => {
        // init the gui if not ready, ?
      },
      [events.USE_MARKER_SELECTED]: (ev) => {
        const { marker } = ev.payload

        getODAPI().dispatchEvent(events.USE_ENTITY_REQUEST_GET_DATA, {
          payload: { intent: 'get-data-after-marker-selected', marker },
        })
      },
      [events.USE_MARKER_DRAGGED]: (ev) => {
        const { marker, state: markerState } = ev.payload as {
          marker: TCanvasMarker
          state: TCanvasMarkerState
        }

        // #region Workaround - dropping marker should correctly recreate entity
        forbidImmediateEntityRecreation()
        defer(() => scheduleDelayedEntityRecreation({ marker }), 30)
        // #endregion
      },
      [events.USE_ENTITY_GUI_UPDATE]: (ev) => {
        const { propOrPath, value, marker } = ev.payload as {
          propOrPath: string
          value: any
          marker: TCanvasMarker
        }

        const dataObjRef = getGuiDataRef()
        console.log('EVENT DISP >>>>>>>>>>>>>>>>>>>>> ', dataObjRef)

        const _didUpdate = basedOnPartial({
          functionName: () => {
            state.currentFunctionName = value

            ///// Request re-update/reset of the GUI
            dataObjRef.functionName = value

            getODAPI().dispatchEvent(events.USE_ENTITY_GUI_REQUEST_RESET, {
              payload: { dataObjRef },
            })

            exposeToWindow({ dataObjRef })

            scheduleDelayedEntityRecreation({ marker })

            return true
          },
          // handle any other prop: editorProps.x .y, .angle, etc.
          default: () => {
            if (state.currentStoredEntity) {
              objectPath.set(dataObjRef, propOrPath, value)

              // TODO:ALE:-1 FIND OUT ALL THE PLACES WE CREATE IT ! ! !
              // !state._entityRecreationIsForbidden && scheduleDelayedEntityRecreation({ marker })

              getGuiDataRef().functionName &&
                getODAPI().dispatchEvent(events.USE_ENTITY_REQUEST_RECREATE_CURRENT, {
                  payload: { marker },
                })

              return !state._entityRecreationIsForbidden
            }
          },
        })(propOrPath as any)
      },
      [events.USE_ENTITY_REQUEST_RECREATE_CURRENT]: (ev) => {
        const { marker } = ev.payload

        // #region Workaround for duplicate-entities issue - part 1
        if (getCurrentlyCreatedEntity() && state._isCurrentlyCreatingEntity) {
          // state.currentEntity && console.log('>>>>> removing current entity 2')
          // state.onEntityRemove(getCurrentlyCreatedEntity(), marker)
        }
        // #endregion

        state._isCurrentlyCreatingEntity = true

        if (state._entityRecreationIsForbidden && !(ev.payload.forceRecreate === true)) return
        if (!getGuiDataRef().functionName) return // safety

        console.log('>>>>> DISP EVENT RECREATING')
        state.currentEntity = createCurrentEntityFromFunction(
          getGuiDataRef(),
          state.entityFunctions
        )

        // #region Workaround for duplicate-entities issue - part 1
        setCurrentlyCreatedEntity(state.currentEntity)
        // #endregion

        //// Notify of the recreated entity
        getODAPI().dispatchEvent(
          state.currentStoredEntity ? events.USE_ENTITY_UPDATE_DATA : events.USE_ENTITY_CREATE,
          {
            payload: {
              entityData: getGuiDataRef(),
              entity: state.currentEntity,
              marker,
            },
          }
        )

        defer(() => {
          sendToTop(marker)

          // #region Workaround for duplicate-entities issue - part 3
          state._isCurrentlyCreatingEntity = false
          setCurrentlyCreatedEntity(null)
          // #endregion
        })
      },
      [events.USE_ENTITY_CREATED]: (ev) => {
        const { storedEntity } = ev.payload as { storedEntity: TStoredEntity }
        if (storedEntity.entity === state.currentEntity) {
          state.currentStoredEntity = storedEntity
        }
      },
      // TODO:ALE:0000 - check this part of the flow
      [events.USE_ENTITY_RESPONSE_GET_DATA]: (ev) => {
        const { intent, storedEntity } = ev.payload
        if (intent === 'get-data-for-entity-GUI' || intent === 'get-data-after-marker-selected') {
          // update even if null
          state.currentStoredEntity = storedEntity
          if (!state.currentStoredEntity) {
            // force it to make sure no entity to be created in any point
            /// TODO:EXTRACT to a func
            // updateGuiDataRef({
            //   ...CANVAS_ENTITY_PRESET,
            //   editorProps: omit(['x', 'y'], CANVAS_ENTITY_PRESET.editorProps),
            // })
            /////
            updateGuiDataRef({ functionName: '' }) // TODO:ALE:00000000 TEST WELL
          }

          console.log(
            '>>>>> DISP EVENT USE_ENTITY_RESPONSE_GET_DATA storedEntity',
            intent,
            storedEntity
          )
        }
      },
    }
  })
