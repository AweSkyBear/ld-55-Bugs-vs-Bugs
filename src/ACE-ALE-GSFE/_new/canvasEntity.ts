import { Func, TCanvasMarker } from '../common/types'

export const CANVAS_ENTITY_PRESET = {
  entityId: null as string | number,
  functionName: '',
  editorProps: {
    x: 0, // the only default is the pos
    y: 0,
  },
  label: undefined,
  remove: () => {},
}

export type TCanvasEntity = typeof CANVAS_ENTITY_PRESET

export type TCanvasEntityGUIActions = Partial<{
  onRemove: Func<TCanvasEntity, void>
  onCopy: Func<TCanvasEntity, void>
  onPaste: Func<TCanvasEntity, void>
}>

export type TStoredEntity = { entityData: TCanvasEntity; entity: any; marker: TCanvasMarker }
