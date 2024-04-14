import { payloadPathOr } from 'obs-disp'
import { addObsDisp, dispatchDeferredEvent, IEvent, IObserver } from '~/OD'
import { getGameCanvas } from '~/common/screen'
import { sceneEvents } from '~/events/sceneEvents'
import { Scene, Size } from '~/common/types'
import { exposeToWindow } from '~/common/debug'
import { gameEvents } from '~/events/gameEvents'

export const ConfigWorldEvents = {
  resizeWorld: (size?: Size) => {
    dispatchDeferredEvent(sceneEvents.RESIZE_WORLD, { payload: { size } })
  },
}
exposeToWindow({ ConfigWorldEvents })

export const initConfigWorld = (scene: Scene): IObserver => {
  const _state = {
    worldSize: null as Size,
    viewportSize: null as Size,
  }

  return addObsDisp(() => {
    const handleResizeWorld = (ev: IEvent & { payload: { size: Size } }) => {
      const worldSize: Size = {
        w: payloadPathOr<number>('size.w', Infinity /*  getScreenDprWidth() */)(ev),
        h: payloadPathOr<number>('size.h', Infinity /*  getScreenDprWidth() */)(ev),
      }
      _state.worldSize = worldSize
      exposeToWindow({ worldSize })

      // scene.cameras.main.roundPixels = true

      //#region ////////////// CAMERA/ WORLD SIZES fix
      const canvas = getGameCanvas()
      scene.cameras.main.setViewport(0, 0, canvas.width, canvas.height)
      _state.viewportSize = { w: canvas.width, h: canvas.height }

      // NOTE:DEBUG

      // NOTE: do NOT set camera bounds, if dealing with an "infinite" world
      // NOTE 2: set it if the camera should be limited into some given area...
      // mainCam(scene).setBounds(worldSize.w / 2, worldSize.h, worldSize.w, worldSize.h)

      scene.matter.world.setBounds(worldSize.w / 2, worldSize.h / 2, worldSize.w, worldSize.h, 1)

      // NO NEED FOR setBounds if we dont need walls
      // scene.matter.world.setBounds(
      //   0,
      //   0,
      //   worldSize.w * 1000,
      //   worldSize.h * 1000, // REMOVING WALLS THE UGLY WAY
      //   64,
      //   // disabling ALL walls for now
      //   false,
      //   false,
      //   false,
      //   false
      // )
    }

    return {
      [sceneEvents.RESIZE_WORLD]: handleResizeWorld,
      [gameEvents.GAME_PLR_RESTARTED]: (ev) => {
        // const plr = payloadPropOr('player', null)(ev) as Sprite
        // plr = plr
      },
      // TODO:D:NOW - move this POST_UPDATE-CAM_FOLLOW LOGIC to the ParachuterObserver
      //// NOTE: fixed via `PlayerSingleton.instanceExists()` ->
      [sceneEvents.POST_UPDATE]: () => {
        //////////////////////////////////////////////////////////////////////////////
        //////////    NB     ALL THE LOGIC BELOW IS  SOLVED VIA SETTING PROPER  camera bounds
        // e.g. x: 0y : 0 will make it such that 0,0 coords are bounds of camera..
        // mainCam(scene).setBounds(worldSize.w / 2, worldSize.h, worldSize.w, worldSize.h)
        //
        ///////////////////////////////

        return
      },
    }
  })
}
