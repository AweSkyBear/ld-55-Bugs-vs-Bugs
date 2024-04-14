import { obsDispCreator, obsDispEvents } from '../OD'
import { sceneEvents } from '~/events/sceneEvents'
import { Global } from './global/global'

export const controlGlobalFlags = obsDispCreator(
  () => {
    const state = {
      frameInd: 0,
    }

    return {
      [obsDispEvents.OBS_CREATE]: () => {
        //
      },
      [obsDispEvents.OBS_REMOVE]: () => {
        //
      },
      [sceneEvents.UPDATE]: () => {
        state.frameInd++

        Global.isEvery30thFrame = state.frameInd % 30 === 0
        Global.isEvery60thFrame = state.frameInd % 60 === 0
      },
    }
  },
  { id: 'control-global-flags' }
)
