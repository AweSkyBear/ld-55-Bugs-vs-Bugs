import { DeepPartial } from '../common/types'
import { TCanvasEntity } from './canvasEntity'

export const mergeEntityData = (
  data: DeepPartial<TCanvasEntity>,
  newData?: DeepPartial<TCanvasEntity>
) => {
  const mergedData = {
    ...data,
    ...newData,
    editorProps: {
      ...data?.editorProps,
      ...newData?.editorProps,
    },
  } as TCanvasEntity

  return mergedData
}
