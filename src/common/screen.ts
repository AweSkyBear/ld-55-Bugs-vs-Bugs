import { propOr, always, checkUntilTrue, defaultTo } from '~/common/func'
import { mainCam } from './camera'
import { isElectron } from './electron'
import { debugLog, exposeToWindow, getGlobalVar, setGlobalVar } from './debug'
import { Point, Scene, MatterImage, Func, Size } from './types'

export const TARGET_FPS = 60

// NOTE!!!: .innerWidth and innerHeight yield STRANGE results (correct on phone - webview!); * but ALMOST!
// when running on comp: in the Chrome dev tools (mobile) emulator! - use the actual monitor size???
// while .outer* work OK!
export const getWindowWH = (): Size => ({
  w: window.outerWidth,
  h: window.outerHeight,
})

/** Useful for positioning texts */
export const getCanvasWH = (): Size => ({
  w: getGameCanvas().width,
  h: getGameCanvas().height,
})

/**
 * Returns 1 when the game is full-screen
 * E.g. if the game is on half-screen will return 0.5
 * Useful for e.g. dom buttons in phaer (to scale them accordingly
 * to the Canvas)
 */
export const getCanvasScale = () => {
  const c = getGameCanvas()
  return parseInt(c.style.width) / c.width
}
export const getCanvasCoordsInfo = () => {
  const c = getGameCanvas()
  const x = c.scrollLeft
  const y = c.scrollTop
  const w = parseInt(c.style.width)
  const h = parseInt(c.style.height)
  const centerPoint = { x: x + w / 2, y: y - h / 2 }
  return {
    centerPoint,
    pos: { x, y },
    size: { w, h },
  }
}

export const getScreenRatio = () =>
  Math.max(getWindowWH().w, getWindowWH().h) / Math.min(getWindowWH().w, getWindowWH().h)

export const IMAGE_DPR = 2 // the  the max DPR -> scale all down to it
export const DPR_MAX = 2 // if bigger, 2 will be used
export const DPR_MIN = 2 // NOTE: try with 2 or 4 -> or
export const DPR = Math.min(DPR_MAX, Math.max(window.devicePixelRatio, DPR_MIN))
export const IMG_SCALE_TO_DPR = IMAGE_DPR / DPR

export const getBiggerDimension = () => Math.max(getWindowWH().w, getWindowWH().h) * DPR
export const getSmallerDimension = () => Math.min(getWindowWH().w, getWindowWH().h) * DPR

export const getGameCanvas = () => document.querySelector('#game canvas') as HTMLCanvasElement

export const getWorldBounds = (scene: Scene) => scene.cameras.main.getBounds()

// export const recordCanvas = require('~/common/recordScreen').recordCanvas

/**
 *  For this to work correctly, images should by default target the HIGHEST dpr we support: 4
 *  E.g. need to be 1) resized to x4, then rescaled with this function every time they are created
 *  or rescaled!
 * If param omitted, then scale the image to the default expectation: 1 by the DPRs
 */
export const getRelativeScale = (scaleTarget: number = 1) => scaleTarget / IMG_SCALE_TO_DPR

/** Useful for positioning of graphics objects */
export const getByDpr = (size: number) => size / DPR
export const multipByDpr = (size: number) => size * DPR

// export const getScaleFactor = (scaleTarget: number = 1) => scaleTarget * IMG_SCALE_TO_DPR
export const getDprX = (x: number) => x * DPR
export const getDprY = (y: number) => y * DPR

export const Rectangle = Phaser.Geom.Rectangle

/** Use for width/height of REX controls */
export const __getDprFactorDueToNotPhone = () => 1 // isEmpty((window as any).cordova) ? 0.70 : 1

const ELECTRON_MAX_WIN_SIZE: Size = {
  w: 1920 / 2,
  h: 1080 / 2,
}

export const getScreenDprWidth = () => Math.min(1920, getWindowWH().w)
// TODO: RE-ENABLE * DPR / *any-other-ratio (must be less than 2) to control game quality!
// OLD - bad - breaks it bad for when Electron:
// isElectron() ? Math.min(ELECTRON_MAX_WIN_SIZE.w, getWindowWH().w * DPR) : getWindowWH().w //* DPR
export const getScreenDprHeight = () => Math.min(1080, getWindowWH().h)
// isElectron() ? Math.min(ELECTRON_MAX_WIN_SIZE.h, getWindowWH().h * DPR) : getWindowWH().h //* DPR

export const getCanvasWidth = () => getCanvasWH().w
export const getCanvasHeight = () => getCanvasWH().h

export const getInstWidth = (obj: MatterImage) => obj.displayWidth
export const getInstHeight = (obj: MatterImage) => obj.displayHeight

/**
 *
 * @param pct The percentage 0 to 100
 * @param base The number to get percentage of; @default screen width
 * @returns
 */
export const getCanvasPXWidthFromPct = (pct: number, base?: number) => {
  return defaultTo(getScreenDprWidth(), base) * (pct / 100)
}

/**
 *
 * @param pct The percentage 0 to 100
 * @param base The number to get percentage of; @default screen height
 * @returns
 */
export const getCanvasPXHeightFromPct = (pct: number, base?: number) => {
  return defaultTo(getScreenDprHeight(), base) * (pct / 100)
}

const getViewRectangle = (grow: number = 0) => {
  const half = Math.max(0, grow / 2)
  return new Rectangle(0 - half, 0 - half, getScreenDprWidth() + grow, getScreenDprHeight() + grow)
}

export const viewContainsPoint = (point: Point, tolerance: number = 0) => {
  return Rectangle.ContainsPoint(getViewRectangle(tolerance), point as any)
}

export const getPointOutsideView = (
  tolerance: number = 200 // TODO:DPR
) => Rectangle.RandomOutside(getViewRectangle(tolerance), getViewRectangle())

export const constrainInstToScreen = (
  inst: MatterImage,
  opts: { offset: number } = { offset: 0 }
) => {
  const { offset } = opts
  const [WIDTH, HEIGHT] = [getScreenDprWidth(), getScreenDprHeight()]

  const instW = getInstWidth(inst) // getDprX(this.inst.width)
  const instH = getInstHeight(inst)
  if (inst.x - (instW / 2 + offset) < 0) {
    inst.x = instW / 2 + offset
  }
  if (inst.y - (instH / 2 + offset) < 0) {
    inst.y = instH / 2 + offset
  }
  if (inst.x > WIDTH - (instW / 2 + offset)) {
    inst.x = WIDTH - (instW / 2 + offset)
  }
  if (inst.y > HEIGHT - (instH / 2 + offset)) {
    inst.y = HEIGHT - (instH / 2 + offset)
  }
}

export const getTopCenter = (scene: Scene, offset: Point = { x: 0, y: 0 }): Point => ({
  // TODO: CHECK IF exchanging getScreenDprWidth with getCanvasWH().w has any issue?
  x: getCanvasWH().w / 2 + offset.x,
  y: 0 + offset.y,
})

export const getBottomCenter = (scene: Scene, offset: Point = { x: 0, y: 0 }): Point => ({
  x: getCanvasWidth() / 2 + offset.x,
  y: getCanvasHeight() + offset.y,
})

export const getBottomLeft = (scene: Scene, offset: Point = { x: 0, y: 0 }): Point => ({
  x: 0 + offset.x,
  y: getCanvasHeight() + offset.y,
})

export const getBottomRight = (scene: Scene, offset: Point = { x: 0, y: 0 }): Point => ({
  x: getCanvasWidth() + offset.x,
  y: getCanvasHeight() + offset.y,
})
export const getCenterRight = (scene: Scene, offset: Point = { x: 0, y: 0 }): Point => ({
  x: getCanvasWidth() + offset.x,
  y: getCanvasHeight() / 2 + offset.y,
})
export const getTopRight = (scene: Scene, offset: Point = { x: 0, y: 0 }): Point => ({
  x: getCanvasWidth() + offset.x,
  y: 0 + offset.y,
})

export const getMidPoint = (scene: Scene, offset: Point = { x: 0, y: 0 }): Point => ({
  x: scene.scale.width / 2 + offset.x,
  y: scene.scale.height / 2 + offset.y,
})
export const getCenterPoint = getMidPoint
setGlobalVar(getMidPoint)

export const getMaxWorldSize = always(Infinity)
export const getCoordOffset = always(getMaxWorldSize() / 2)

export const getCoordsForDisplay = (label: string, coordValue: number, divideBy = 1000) => {
  const displayValue = coordValue / divideBy
  const shouldPad1Char = displayValue > 0
  return `${label}${shouldPad1Char ? ' ' : ''}${displayValue.toFixed(2)}`
}

export const getGameObjectScreenMidPos = (
  scene: Scene,
  gameObject: Phaser.GameObjects.Components.ComputedSize & { originX: number; originY: number }
) => {
  const mid = getMidPoint(scene, { x: gameObject.originX, y: gameObject.originX })
  return {
    x: mainCam(scene).scrollX + mid.x, // - gameObject.displayWidth / 2,
    y: mainCam(scene).scrollY + mid.y, // - gameObject.displayHeight / 2,
  }
}

export const getMonitorRefreshRate = (
  opts: { callback?: Func<any, void>; count: number } = {} as any
): Promise<number> =>
  new Promise((resolve) => {
    var requestFrame = window.requestAnimationFrame
    if (!requestFrame) return true // Check if "true" is returned;
    // pick default FPS, show error, etc...
    function checker() {
      if (index--) requestFrame(checker)
      else {
        // var result = 3*Math.round(count*1000/3/(performance.now()-start));
        var result = (count * 1000) / (performance.now() - start)
        if (typeof opts.callback === 'function') opts.callback(result)
        resolve(result)
      }
    }
    var count = opts.count || 60,
      index = count,
      start = performance.now()
    checker()
  })

setGlobalVar(getMonitorRefreshRate)

export const getConsistentRefreshRate = () => getGlobalVar<number>('__FPS')

export const getPhysicsUpdateFrameInd = () => getConsistentRefreshRate() / TARGET_FPS
setGlobalVar(getPhysicsUpdateFrameInd)

/**
 * Returns a boolean result whether the frame should be considered 'scene.update' regardless
 * the screen refresh rate (e.g. for 144hz this is every 2.4 frames)
 */
export const isCorrectedUpdateFrame = () => {}

export const getAndroidDeviceDisplayRate = () => {
  return new Promise(async (resolve) => {
    await (window as any).device.getRefreshRate((res) => {
      debugLog('RESULT', res)
      resolve(res)
    })

    resolve(null) // FAIL
  })
}

// const LOCAL_DEV_REFRESH_RATE = propOr(144, 'devRefreshRate')(localDevConfig)

/** NO LONGER NEEDED ::: On Android, this will return the native refresh rate; if it fails -> returns null */
// export const getDeviceRefreshRate = async () => {
//   // NON ANDROID

//   /// TODO: RE-enable after
//   if (!getGlobalVar<any>('window').device || !getGlobalVar<any>('window').device.getRefreshRate) {
//     return LOCAL_DEV_REFRESH_RATE

//     const nonAndroidRes = await getMonitorRefreshRate({ count: 60 * 3 })
//     return nonAndroidRes
//   }

//   let finalRes = null
//   await checkUntilTrue(
//     async () => {
//       const res = await getAndroidDeviceDisplayRate()
//       if (res) finalRes = res
//       return finalRes === null
//     },
//     5000,
//     500
//   )

//   debugLog('FINAL DEVICE REFRESH RATE: ', finalRes)
//   return finalRes
// }
