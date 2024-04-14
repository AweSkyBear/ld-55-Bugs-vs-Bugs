import { obsDispEvents } from 'obs-disp'
import { Global } from '~/LD55/global/global'
import { addObsDisp } from '~/OD'
import { mainCam } from '~/common/camera'
import { getScreenDprWidth } from '~/common/screen'
import { gameEvents } from '~/events/gameEvents'
import { IObsDispOnCreateEvent } from '~/events/obsDispEvents'
import { ObservableScenes } from '~/scenes/BaseObservableScene'

/** Adjusts automatically the base zoom value based on the number of pixels */
const setBaseGameZoom = () => {
  // SET BASE ZOOM :::
  const cam = mainCam(ObservableScenes.game)
  const camSceneBackground = mainCam(ObservableScenes.background)
  const camSceneForeground = mainCam(ObservableScenes.foreground)
  // calculate base zoom...

  let zoom = 1
  const fourMillionPixels = 4e6
  while ((cam.displayWidth * cam.displayHeight) / zoom < fourMillionPixels) {
    zoom = zoom - 0.01
    cam.setZoom(zoom)
  }

  return zoom
  // camSceneBackground.zoom = zoom
  // camSceneForeground.zoom = zoom
}

const setBaseForegroundSceneZoom = () => {
  // SET BASE ZOOM :::
  const cam = mainCam(ObservableScenes.foreground)
  const screenW = getScreenDprWidth()
  if (getScreenDprWidth() < 1920) {
    const zoomRatio = (screenW * 1.2) / 1920
    cam && cam.setZoom(zoomRatio)
  }
}

export const createCamera = () => {
  const scene = ObservableScenes.game
  const state = {
    baseGameZoom: -1,
  }

  return addObsDisp({
    [obsDispEvents.OBS_CREATE]: ({ payload: {} }) => {
      state.baseGameZoom = setBaseGameZoom()
      Global.baseGameZoom = state.baseGameZoom

      setTimeout(() => setBaseForegroundSceneZoom(), 100)
    },
    [gameEvents.GAME_PAUSE]: () => {
      mainCam(scene).setZoom(0.1) // TODO:REMOVE?
    },
    [gameEvents.GAME_RESUME]: () => {
      mainCam(scene).setZoom(state.baseGameZoom)
    },
    [gameEvents.GAME_START]: () => {},
    [gameEvents.GAME_END]: () => {},
    [obsDispEvents.OBS_REMOVE]: () => {
      mainCam(scene).stopFollow()
    },
  })
}
