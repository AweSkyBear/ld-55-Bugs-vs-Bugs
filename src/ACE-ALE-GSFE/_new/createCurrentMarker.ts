import { TCanvasMarker } from '../common/types'
import { getGuiDataRef, updateGuiDataRef } from './global/guiDataRef'
import { TCanvasEntity } from './canvasEntity'
import { getODAPI } from './createEditor'
import { events } from './events'
import { getSelectedMarker, setSelectedMarker } from './global/selectedMarker'
import { updateEntityGUIField } from './updateEntityGUIField'
import { defer } from '~/common/func'

export const createCurrentMarker = () =>
  getODAPI().addObsDisp(() => {
    const state = {
      currentMarker: null as TCanvasMarker,
    }

    return {
      // TODO: track it, update it
      [events.USE_MARKER_TAP]: (ev) => {
        const [x, y] = [ev.payload.x, ev.payload.y]
        state.currentMarker = ev.payload.marker

        getODAPI().dispatchEvent(events.USE_MARKER_SELECTED, {
          payload: { marker: state.currentMarker, x, y },
        })
      },
      // [events.USE_SCREEN_TAP]: (ev) => {
      //   state.currentMarker = null
      //   getODAPI().dispatchEvent(events.USE_MARKER_DESELECTED)
      //   // init the gui if not ready,
      // },
      // [events.USE_MARKER_SELECTED]: (ev) => {
      //   const { marker } = ev.payload
      //   setSelectedMarker(marker)
      // },
      [events.USE_ENTITY_UPDATE_DATA]: (ev) => {
        const { marker, entity, entityData } = ev.payload as {
          entityData: TCanvasEntity
          entity: any
          marker: TCanvasMarker
        }

        // move the marker correspondingly
        marker.setPosition(entityData.editorProps.x, entityData.editorProps.y)
      },
      [events.USE_MARKER_DRAGGED]: (ev) => {
        // TODO:ALE:0000000000000 - validate that's totally Not needed - seems to be ok !
        // const { marker, x, y } = ev.payload //// TODO:ALE:00000000 - CHECK IF NEEDED !
        // // TODO:ALE:0000000000 - continue here ->>>> fix this in a better way
        // /* YES -> */ updateGuiDataRef({ editorProps: { x: parseInt(x), y: parseInt(y) } })
        // // updateEntityGUIField('editorProps.x', x, getGuiDataRef(), marker) // trigger the update ...
        // //
        // defer(() => updateEntityGUIField('editorProps.y', y, getGuiDataRef(), marker), 100)
      },
    }
  })
