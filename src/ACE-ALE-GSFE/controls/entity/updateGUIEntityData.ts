import { TCanvasEntity } from '../../_new/canvasEntity'
import { mergeEntityData } from '../../_new/mergeEntityData'
import { DeepPartial } from '../../common/types'
import { getGuiDataRef } from '../../_new/global/guiDataRef'

export const updateGUIEntityData = (data: DeepPartial<TCanvasEntity>) =>
  Object.assign(getGuiDataRef(), mergeEntityData(getGuiDataRef(), data))
