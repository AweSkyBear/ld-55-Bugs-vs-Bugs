import { exposeToWindow } from './debug'
import { callAll, noop, prop, compose, defaultTo, path, pick } from './func'
import {
  Camera,
  CameraPanCallback,
  CamScrollPoint,
  Easing,
  Func,
  GameObject,
  Point,
  Scene,
} from './types'

export const CameraActions = {
  panTo: (
    scene: Scene,
    {
      pos,
      duration = 1000,
      easing = Easing.Quadratic.Out,
      onComplete = noop,
      force = true,
    }: {
      pos: Point
      duration?: number
      easing?: Func<any, any>
      force?: boolean
      onComplete?: CameraPanCallback
    }
  ) => {
    return new Promise<any>((resolve) => {
      mainCam(scene).pan(pos.x, pos.y, duration, easing, force)
      mainCam(scene).once(
        Phaser.Cameras.Scene2D.Events.PAN_COMPLETE,
        callAll(onComplete as any, resolve)
      )
    })
  },
  startFollow: (scene: Scene, objToFollow: GameObject) => {
    const LERP = 0.5
    mainCam(scene).startFollow(objToFollow, false, LERP, LERP)
  },
}

// TODO:
export const smoothZoom = (
  scene: Scene,
  {
    zoom,
    duration,
    easing,
    onProgress,
    onComplete,
  }: {
    zoom: number
    duration?: number
    easing?
    onProgress?: CameraPanCallback
    onComplete?: Func<never, void>
  }
) =>
  new Promise<void>((resolve) =>
    mainCam(scene).zoomTo(
      zoom,
      defaultTo(2000, duration),
      defaultTo(Easing.Expo.InOut, easing),
      true,
      callAll(onProgress as any, (_, progress) => {
        if (progress === 1) {
          onComplete && onComplete()
          resolve()
        }
      })
    )
  )

export const fadeOut = (camera: Camera, duration: number) => {
  return new Promise((resolve) =>
    camera.fadeOut(duration, 0, 0, 0, () => {
      resolve(null)
    })
  )
}
export const fadeIn = (camera: Camera, duration: number) => {
  return new Promise((resolve) =>
    camera.fadeIn(duration, 0, 0, 0, () => {
      resolve(null)
    })
  )
}

export const mainCam = path<Camera>(['cameras', 'main'])
export const mainCamViewport: Func<Scene, Point> = compose(
  pick(['x', 'y']),
  prop('worldView') as any,
  path<Camera>(['cameras', 'main'])
) as any
export const camScrollPos = (cam: Camera): Point => ({ x: cam.scrollX, y: cam.scrollY })

export const mainCamScrollPos = compose<Camera, CamScrollPoint>(
  (cam) => ({ scrollX: cam.scrollX, scrollY: cam.scrollY }),
  mainCam as any
)

export const getCamScrollPos = (scene: Scene) => ({
  x: mainCam(scene).scrollX,
  y: mainCam(scene).scrollY,
})

exposeToWindow({ mainCam })
