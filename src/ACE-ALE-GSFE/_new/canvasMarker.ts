import { exposeToWindow } from '~/common/debug'
import { TCanvasMarker } from './types'
import { arePointsEqual, defer } from '../common/func'
import { Scene } from '~/common/types'

export const MARKER = {
  DEF_COLOR: 0x0000ff,
  SELECT_COLOR: 0x00aaff,
}

const _markers = []
exposeToWindow({ _markers })

export type TCanvasMarkerState = {
  isCurrentlyMoving: boolean
}
const updateMarkerState = (marker: TCanvasMarker, state: TCanvasMarkerState) =>
  marker.setData(state)
const getMarkerState = (marker: TCanvasMarker) => marker.data.getAll() as TCanvasMarkerState

// #PhaserDep
const getPointerPos = (scene: Scene) => ({
  x: scene.input.activePointer.worldX,
  y: scene.input.activePointer.worldY,
})

/** Creates and puts an interactible item (marker) for a Function Entity onto the canvas */
export const canvasMarker = (conf: {
  scene: Phaser.Scene
  pos: { x; y }
  onClick: (marker: TCanvasMarker, ev) => void
  onDrag?: (marker: TCanvasMarker) => void
  onDragStart?: (marker: TCanvasMarker) => void
  onDragEnd?: (marker: TCanvasMarker, state: TCanvasMarkerState) => void
  // onDrop: () =>
  // onDragging: () =>
}) => {
  const { scene, pos, onClick, onDrag, onDragStart, onDragEnd } = conf

  // #PhaserDep
  const marker = scene.add
    .circle(pos.x, pos.y, 28, MARKER.DEF_COLOR, 0.5)
    .setInteractive()
    .setName('marker')

  scene.input.setDraggable(marker)

  _markers.push(marker)

  // let _isCurrentlyMoving = false
  let _lastPointerPos = { x: -1, y: -1 }

  // updateMarkerState(marker, { isCurrentlyMoving: false })

  marker.scene.events.on(Phaser.Scenes.Events.PRE_RENDER, (...ev) => {
    // console.log('Phaser.Scenes.Events.UPDATE') //, ...ev)
    // updateMarkerState(marker, { isCurrentlyMoving: false })
    // _isCurrentlyMoving = false
  })

  marker.on(Phaser.Input.Events.POINTER_MOVE, (...ev) => {
    // console.log('Phaser.Scenes.Events.POINTER_MOVE') //, ...ev)
    // updateMarkerState(marker, { isCurrentlyMoving: true })
    defer(() => (_lastPointerPos = getPointerPos(scene)))

    // _isCurrentlyMoving = true
  })

  marker.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (ev) => onClick(marker, ev))

  marker.on(Phaser.Input.Events.GAMEOBJECT_DRAG, (pointer, dragX, dragY) => {
    onDrag?.(marker)
    console.log(
      'GAMEOBJECT_DRAG dragX, dragY',
      scene.input.activePointer.worldX,
      scene.input.activePointer.worldY
    )
    marker.x = scene.input.activePointer.worldX
    marker.y = scene.input.activePointer.worldY

    // updateMarkerData(marker, { editorProps: { x: marker.x, y: marker.y } })
  })
  marker.on(Phaser.Input.Events.GAMEOBJECT_DRAG, (pointer, gameObject, dragX, dragY) => {
    onDragStart?.(marker)
    // console.log('DRAGEND dragX, dragY', dragX, dragY, marker.x, marker.y)
  })

  marker.on(Phaser.Input.Events.GAMEOBJECT_DRAG_END, (pointer, gameObject, dragX, dragY) => {
    const isCurrentlyMoving = !arePointsEqual(_lastPointerPos, getPointerPos(scene))

    onDragEnd?.(marker, { isCurrentlyMoving } as TCanvasMarkerState)
    console.log('DRAGEND isMoving', { isCurrentlyMoving } as TCanvasMarkerState)
    // onDragEnd?.(marker, getMarkerState(marker))
    // console.log('DRAGEND isMoving', getMarkerState(marker).isCurrentlyMoving)
    // // console.log('DRAGEND dragX, dragY', dragX, dragY, marker.x, marker.y)
  })

  // updateMarkerData(marker, {
  //   ...CANVAS_ENTITY_PRESET,
  //   editorProps: {
  //     ...CANVAS_ENTITY_PRESET.editorProps,
  //   },
  //   entityId: uniqId('ale-'),
  // })

  return marker
}
