import { exposeToWindow } from '~/common/debug'
import { TCanvasMarker } from '../../common/types'

let _selectedMarker: TCanvasMarker = null

export const getSelectedMarker = () => _selectedMarker
export const setSelectedMarker = (marker: TCanvasMarker) => (_selectedMarker = marker)

exposeToWindow({ getSelectedMarker })
