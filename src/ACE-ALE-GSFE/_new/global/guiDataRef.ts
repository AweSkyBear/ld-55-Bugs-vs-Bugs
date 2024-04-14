import { exposeToWindow } from '~/common/debug'
import { CANVAS_ENTITY_PRESET, TCanvasEntity } from '../canvasEntity'
import { mergeEntityData } from '../mergeEntityData'
import { updateMarkerData } from '../updateMarkerData'
import { DeepPartial } from '../../common/types'

export let _guiData = Object.assign(CANVAS_ENTITY_PRESET) as TCanvasEntity

export const getGuiDataRef = () => _guiData

export const updateGuiDataRef = (data: DeepPartial<TCanvasEntity>) =>
  (_guiData = Object.assign(_guiData, mergeEntityData(_guiData, data)))

export const setGuiDataRef = (obj) => (_guiData = obj)

exposeToWindow({ getGuiDataRef })
