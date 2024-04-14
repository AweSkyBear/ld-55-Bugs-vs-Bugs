import { IObsDispAPI, IObserver, ObsDispCreate, createAPI, obsDispEvents } from 'obs-disp'
import { events } from './events'
import { TCanvasMarker } from '../common/types'
import { setEntityFunctions } from './global/entityFunctions'
import { exposeToWindow } from '~/common/debug'
import { createCanvasEvents } from './createCanvasEvents'
import { createCanvasMarkersManager } from './createCanvasMarkersManager'
import { createEntityStore } from './createEntityStore'
import { createCurrentEntity } from './createCurrentEntity'
import { createEntityGUI } from './createEntityGUI'
import { createCurrentMarker } from './createCurrentMarker'
import { waitMs } from '../common/func'

let _ODAPI: IObsDispAPI = null
let _editorObs: IObserver = null

export const createEditor = (config: {
  scene: Phaser.Scene
  exposedVariables?: Record<any, any>
  miscFunctions?: Record<any, Function>
  entityFunctions: Record<any, Function>

  propTypes: Record<string, any>
  onEditStop?: () => void // TODO:ALE:0: handle
  onEditStart?: () => void // TODO:ALE:0: handle
  onEntityAdd?: (entity: any, marker: TCanvasMarker) => void
  onEntityUpdate?: (entity: any, marker: TCanvasMarker, rerunCreate: () => void) => void
  onEntityRemove?: (entity: any, marker: TCanvasMarker) => void
  //TODO:ALE:3:L - provide ability to pass entityFunction-to-custom-properties map!
  // -> this way WE control what we'll be editing
}) => {
  if (!_ODAPI) {
    _ODAPI = createAPI({
      //// for debugging
      onEvent: (ev) =>
        !['INPUT_UPDATE', 'GAME_UPDATE'].includes(ev.name) && console.log('EVENT DISP', ev.name),
      onObsCreated: (obs) => console.log('OBS ADDED', obs),
      onObsRemoved: (obs) => console.log('OBS REMOVED', obs),
      onWarn: ({ msg, params }) => console.log('WARN: ', msg, params),
    })
  }

  if (!_editorObs) {
    _editorObs = _ODAPI.addObsDisp(
      () => {
        const { scene } = config

        return {
          [obsDispEvents.OBS_CREATE]: ObsDispCreate.useObs(async (obs) => {
            // TODO:ALE:000000000 - add a waiter for the scene to become available????
            // await waitMs(1000)

            obs.addOD(createCanvasEvents({ scene }))
            obs.addOD(createCanvasMarkersManager({ scene }))
            obs.addOD(createEntityStore())
            obs.addOD(createCurrentEntity())
            obs.addOD(createCurrentMarker())
            obs.addOD(createEntityGUI())

            obs.dispatchEvent(events.USE_CONFIGURE, { payload: config })

            const { entityFunctions, exposedVariables } = config

            const state = {
              isEditing: false,
            }

            setEntityFunctions(entityFunctions)

            // debug
            exposeToWindow({
              ALE: {
                entityFunctions,
                exposedVariables,
              },
            })
          }),
          [events.USE_EDIT_START]: () => {
            //
          },
          [events.USE_EDIT_END]: () => {
            //
          },
          [obsDispEvents.OBS_REMOVE]: () => {
            //
          },
        }
      },
      { id: 'ale-editor' }
    )
  }

  return _editorObs
}

export const getODAPI = () => _ODAPI

exposeToWindow({ getODAPI })
