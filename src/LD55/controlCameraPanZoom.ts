import { addObsDisp, createThrottledDispatch, dispatchEvent, obsDispEvents } from '~/OD'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { sceneEvents } from '~/events/sceneEvents'
import { inputEvents } from '~/events/inputEvents'
import { payloadProp } from '~/OD'
import { mainCam } from '~/common/camera'
import { isInGame } from '~/game/airbornDelivery/global/GameStateSingleton'
import { Global } from './global/global'

const PAN_SPEED = 15

export const controlCameraPanZoom = () => {
  const scene = ObservableScenes.game
  const state = {
    wasd: [false, false, false, false] as [boolean, boolean, boolean, boolean],
  }

  const handleMouseScroll = (pointer, currentlyOver, dx, dy, dz, event) => {
    //#region Camera zoom on scroll
    /* ... */ console.log('scrolled', dx, dy, dz)
    const scrollUp = dy < 0
    const curZoom = mainCam(scene).zoom
    mainCam(scene).zoomTo(Phaser.Math.Clamp(curZoom + (scrollUp ? 1 : -1) * 0.2, 0.01, 2), 300)
    //#endregion
  }
  const handleMouseBtnClick = ({ button }) => {
    const isMiddleClicked = button === 1
    // console.log('handleMiddleMouseClick', ...args)
    isMiddleClicked && mainCam(scene).zoomTo(Global.baseGameZoom, 300)
  }

  return addObsDisp({
    [obsDispEvents.OBS_CREATE]: ({ payload: {} }) => {
      scene.input.on('wheel', handleMouseScroll)
      scene.input.on(Phaser.Input.Events.POINTER_DOWN, handleMouseBtnClick)
    },
    [inputEvents.INPUT_UPDATE_STATE]: (ev) => {
      const keys = payloadProp<Record<string, boolean>>('keys')(ev)
      state.wasd = [keys.w, keys.a, keys.s, keys.d]
    },
    [sceneEvents.UPDATE]: () => {
      if (!isInGame()) return

      const zoom = mainCam(scene).zoom
      if (state.wasd[0]) {
        // console.log('HOLDING W')
        // w
        mainCam(ObservableScenes.game).scrollY -= PAN_SPEED / zoom
      }
      if (state.wasd[1]) {
        // a
        mainCam(ObservableScenes.game).scrollX -= PAN_SPEED / zoom
      }
      if (state.wasd[2]) {
        // s
        mainCam(ObservableScenes.game).scrollY += PAN_SPEED / zoom
      }
      if (state.wasd[3]) {
        // d
        mainCam(ObservableScenes.game).scrollX += PAN_SPEED / zoom
      }
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      // TODO: remove events
      scene.input.off('wheel', handleMouseScroll)
      scene.input.off(Phaser.Input.Events.POINTER_DOWN, handleMouseBtnClick)
    },
  })
}
