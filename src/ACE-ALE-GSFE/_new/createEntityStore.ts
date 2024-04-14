import { exposeToWindow } from '~/common/debug'
import { TCanvasEntity, TStoredEntity } from './canvasEntity'
import { TCanvasMarker } from '../common/types'
import { getODAPI } from './createEditor'
import { events } from './events'
import { TEntityId } from './types'
import { TEditorConfig } from '../plugEditor'
import { mergeEntityData } from './mergeEntityData'
import { getSelectedMarker } from './global/selectedMarker'

let _entityId = 0

export const createEntityStore = () =>
  getODAPI().addObsDisp(() => {
    const state = {
      storedEntityById: new Map<TEntityId, TStoredEntity>(),
      storedEntityByMarker: new Map<TCanvasMarker, TStoredEntity>(),
      onEntityRemove: null as TEditorConfig['onEntityRemove'],
    }
    exposeToWindow(state)

    return {
      [events.USE_CONFIGURE]: (ev) => {
        const { onEntityRemove } = ev.payload as TEditorConfig
        state.onEntityRemove = onEntityRemove
      },
      [events.USE_ENTITY_UPDATE_DATA]: (ev) => {
        const { marker, entity, entityData } = ev.payload as {
          entityData: TCanvasEntity
          entity: any
          marker: TCanvasMarker
        }

        const storedEntity = state.storedEntityByMarker.get(marker)

        if (!storedEntity) {
          console.warn('No stored entity: marker, entity, entityData ', marker, entity, entityData)
          return
        }

        const updatedStoredEntity = {
          ...storedEntity,
          entity,
          entityData: mergeEntityData(storedEntity.entityData, entityData),
        }
        state.storedEntityById.set(entityData.entityId, updatedStoredEntity)
        state.storedEntityByMarker.set(marker, updatedStoredEntity)

        // remove the previous entity
        // TODO:ALE:00000000- THIS BUGS IT - SOMETIMES REMOVES THE NEW ENTITY
        storedEntity?.entity &&
          getODAPI().dispatchEvent(events.USE_ENTITY_REMOVE_CURRENT, {
            payload: { marker, entity: storedEntity.entity },
          })
      },
      [events.USE_ENTITY_CREATE]: (ev) => {
        const { entityData, entity, marker } = ev.payload as {
          entityData: TCanvasEntity
          entity: any
          marker: TCanvasMarker
        }

        entityData.entityId = entityData.entityId || ++_entityId

        const newStoredEntity: TStoredEntity = { entityData, entity, marker }
        state.storedEntityById.set(entityData.entityId, newStoredEntity)
        state.storedEntityByMarker.set(marker, newStoredEntity)

        getODAPI().dispatchEvent(events.USE_ENTITY_CREATED, {
          payload: { storedEntity: newStoredEntity },
        })
      },
      [events.USE_ENTITY_REMOVE_CURRENT]: (ev) => {
        const { marker, entity } = ev.payload

        // TODO:ALE:000000000000 - BUG BUG BUG
        // const storedEntity = state.storedEntityByMarker.get(marker)
        // if (storedEntity.entity === entity) {
        //   storedEntity.entity = null
        // }
        state.onEntityRemove(entity, marker)
      },
      [events.USE_ENTITY_REQUEST_GET_DATA]: (ev) => {
        const { marker, intent } = ev.payload
        if (marker) {
          getODAPI().dispatchEvent(events.USE_ENTITY_RESPONSE_GET_DATA, {
            payload: { intent, storedEntity: state.storedEntityByMarker.get(marker) },
          })
        }
      },
    }
  })
