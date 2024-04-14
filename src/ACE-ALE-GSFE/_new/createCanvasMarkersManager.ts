import { canvasMarker } from './canvasMarker'
import { TCanvasMarker } from '../common/types'
import { getODAPI } from './createEditor'
import { events } from './events'
import { getSelectedMarker, setSelectedMarker } from './global/selectedMarker'
import { arePointsEqual, defer, pick } from '../common/func'

/** CRUD and marker events */
export const createCanvasMarkersManager = (c: { scene: Phaser.Scene }) =>
  getODAPI().addObsDisp(() => {
    const { scene } = c

    const state = {
      // markersMap: null as Map<TMarkerId, PhaserCircle>,
      markersArr: [] as TCanvasMarker[],
    }

    return {
      [events.USE_SCREEN_TAP]: (ev) => {
        console.log('USE_SCREEN_TAP', ev)
        const [x, y] = [parseInt(ev.payload.x), parseInt(ev.payload.y)]

        // note: sub-optimal:
        // #PhaserDep
        const existingMarker = state.markersArr.find((m) => {
          // console.log(
          //   'm.input.hitArea',
          //   new Phaser.Geom.Rectangle(
          //     m.input.hitArea.x + m.x,
          //     m.input.hitArea.y + m.y,
          //     m.input.hitArea.width,
          //     m.input.hitArea.height
          //   ),
          //   { x, y } as any,
          //   m,
          //   'CONTAINS POINT',
          //   Phaser.Geom.Rectangle.ContainsPoint(
          //     new Phaser.Geom.Rectangle(
          //       m.input.hitArea.x + m.x,
          //       m.input.hitArea.y + m.y,
          //       m.input.hitArea.width,
          //       m.input.hitArea.height
          //     ),
          //     new Phaser.Geom.Point(x, y)
          //   )
          // )

          return Phaser.Geom.Rectangle.ContainsPoint(
            new Phaser.Geom.Rectangle(
              m.input.hitArea.x + m.x - m.input.hitArea.width / 2,
              m.input.hitArea.y + m.y - m.input.hitArea.height / 2,
              m.input.hitArea.width,
              m.input.hitArea.height
            ),
            new Phaser.Geom.Point(x, y)
          )
        })

        console.log('existingMarker', existingMarker)

        if (!existingMarker) {
          getODAPI().dispatchEvent(events.USE_MARKER_CREATE, { payload: { x, y } })
        } else {
          getODAPI().dispatchEvent(events.USE_MARKER_TAP, {
            payload: { x, y, marker: existingMarker },
          })
        }
        // deselect selected one; if no selected one -> MARKER_CREATE
      },
      [events.USE_MARKER_CREATE]: (ev) => {
        const [x, y] = [ev.payload.x as number, ev.payload.y as number]

        // create a marker
        const newMarker = canvasMarker({
          scene,
          pos: { x, y },
          onClick: (marker) => {
            if (getSelectedMarker() !== marker) {
              setSelectedMarker(marker)
              getODAPI().dispatchEvent(events.USE_MARKER_SELECTED, { payload: { marker } })
            }

            // storeMarkerPrevPos(marker)
          },
          onDragStart: (marker) => {
            // storeMarkerPrevPos(marker)
          },
          onDrag: (marker) => {
            getSelectedMarker() !== marker &&
              getODAPI().dispatchEvent(events.USE_MARKER_SELECTED, { payload: { marker } })

            getODAPI().dispatchEvent(events.USE_MARKER_DRAG, { payload: { marker } })
          },
          onDragEnd(marker, state) {
            // marker.data.set({ prevPos }) = // monkey-patch
            // TODO:ALE:0000 - now should fix the case when dragging directly -> setSelectedMarker in DRAG_START
            console.log(
              'getMarkerPrevPos(marker), getMarkerPos',
              getMarkerPrevPos(marker),
              getMarkerPos(marker)
            )
            if (arePointsEqual(getMarkerPrevPos(marker), getMarkerPos(marker))) {
              // storeMarkerPrevPos(marker)
              return // fixes just-clicked-marked-considered-dragged
            }

            if (marker !== getSelectedMarker()) return
            storeMarkerPrevPos(marker)
            getODAPI().dispatchEvent(events.USE_MARKER_DRAGGED, {
              payload: {
                marker: newMarker,
                x: parseInt(marker.x as any),
                y: parseInt(marker.y as any),
                state,
              },
            })
          },
        })
        state.markersArr.push(newMarker)

        getODAPI().dispatchEvent(events.USE_MARKER_SELECTED, {
          payload: { marker: newMarker, x, y },
        })
      },
    }
  })

const storeMarkerPrevPos = (marker: TCanvasMarker) => {
  console.log('storeMarkerPrevPos store the pos', getMarkerPos(marker))
  marker.setData('prevPos', getMarkerPos(marker))
}
const getMarkerPrevPos = (marker: TCanvasMarker) => marker.data?.get('prevPos')

export const getMarkerPos = pick(['x', 'y'])
