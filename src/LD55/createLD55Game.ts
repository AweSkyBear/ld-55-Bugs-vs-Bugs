import { obsDispEvents } from 'obs-disp'
import { addObsDisp, dispatchDeferredEvent } from '~/OD'
import { gameEvents } from '~/events/gameEvents'
import { setGameState } from '~/game/airbornDelivery/global/GameStateSingleton'
import { controlCrosshairCreation } from './controlCrosshairCreation'
import { controlPlayerSummoning } from './controlPlayerSummoning'
import { controlPause } from './controlPause'
import { controlCameraPanZoom } from './controlCameraPanZoom'
import { controlBugCreation } from './controlBugCreation'
import { createEarth } from './createEarth'
import { createBottomLeftUI } from './createBottomLeftUI'
import { controlGlobalFlags } from './controlGlobalFlags'
import { controlPoints } from './controlPoints'
import { events } from './events'
import { createTimer } from './createTimer'
import { controlGameLostDialog } from './controlGameLostDialog'
import { exposeToWindow } from '~/common/debug'
import { controlBottomActions } from './controlBottomActions'
import { Global } from './global/global'

// only initial entry point actions dispatched!
export const createLD55Game = () => {
  return addObsDisp(
    {
      [obsDispEvents.OBS_CREATE]: ({ payload: { obs } }) => {
        // TODO:LATER:LD:CONTINUE later - sth else - for now - direct start
        setGameState('in-game')

        // Core:
        createEarth()
        createTimer()

        controlCrosshairCreation()
        controlPlayerSummoning()

        controlBugCreation()

        controlBottomActions()

        controlGameLostDialog()

        // Points & bonuses
        controlPoints()

        // UI:
        createBottomLeftUI()

        // MISC:
        controlGlobalFlags()
        controlCameraPanZoom()
        controlPause()

        // Start game
        dispatchDeferredEvent(events.LD_GAME_START)
      },
      [events.LD_GAME_START]: () => {
        // reset
        Global.earthHp = 100
      },
      [obsDispEvents.OBS_REMOVE]: () => {
        // GlobalObservers.removeMultipleObs(observers)
        // _state.keySpace?.destroy()
        // _state.keySpace = null
      },
    },
    { id: 'ld-55-game' }
  )
}

exposeToWindow({ createLD55Game })
