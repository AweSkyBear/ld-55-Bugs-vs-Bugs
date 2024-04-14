import { obsDispEvents } from 'obs-disp'
import { getODAPI } from './createEditor'
import { events } from './events'
import { TCanvasMarker } from '../common/types'

const SCREEN_TAP_MS = 300
export const createCanvasEvents = (c: { scene: Phaser.Scene }) => {
  return getODAPI().addObsDisp(() => {
    const { scene } = c

    const state = {
      _pointerTapStart: -1,
      currentlyPressingMarker: false,
    }

    const handleScreenTap = () => {
      const { worldX, worldY } = scene.input.activePointer

      // if (!_pressingOnMarker) {
      ///// IF CLICK ON EMPTY SPACE
      getODAPI().dispatchEvent(events.USE_SCREEN_TAP, {
        payload: { x: worldX, y: worldY },
      })
    }

    return {
      [obsDispEvents.OBS_CREATE]: () => {
        // attach handlers
        state.currentlyPressingMarker = false

        //// dirty - marker and screen click events:
        let _pressingOnMarker: TCanvasMarker = null
        scene.input.on(Phaser.Input.Events.POINTER_DOWN, () => {
          state._pointerTapStart = Date.now()
        })

        scene.input.on(Phaser.Input.Events.POINTER_UP, async () => {
          // simulate a single tap - cancel in case
          if (Date.now() - state._pointerTapStart < SCREEN_TAP_MS) {
            state._pointerTapStart = Date.now()

            handleScreenTap()
          }
        })
        // dispatch events.SCREEN_CLICK, then MARKER_CLICK, events.USE_ENTITY_SELECT
      },
      //
    }
  })
}
