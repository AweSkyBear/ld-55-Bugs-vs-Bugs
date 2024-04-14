/// <reference types= "../node_modules/phaser/types" />
import Phaser from 'phaser'
Phaser /* needed */

declare const window: Window & {
  cordova: { file: any; platformId: string }
  DisplayCutout?: any
  electronAPI: any
}

import { getGameCanvas, getScreenDprWidth, getScreenDprHeight } from '~/common/screen'
import { BootScene } from '~/scenes/BootScene'
import BackgroundScene from '~/scenes/BackgroundScene'
import { noop, waitMs } from '~/common/func'
import ForegroundScene from '~/scenes/ForegroundScene'
import { debugLog, debugWarn } from '~/common/debug'
import { IMatterWorldConfig } from '~/common/matter'

import { initializeEditor } from './ACE-ALE-GSFE/initializeEditor'
import HueRotatePostFX from './fx/pipelines/HueRotatePostFX'
import { registerPipelines } from './scenes/common'

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config)
  }
}

const IS_PHONE = navigator.userAgent.match(
  /(iPhone|iPod|iPad|Android|BlackBerry|IEMobile|IS_MOCKED_PHONE)/
)
// note: this can be added to the Chrome Mobile DevTools userAgent (to virtual devices)
const IS_MOCKED_PHONE = navigator.userAgent.match(/(IS_MOCKED_PHONE)/)

export const onDeviceReady = async () => {
  const configureDisplayCutout = window.DisplayCutout
    ? () =>
        new Promise<void>((resolve, reject) => {
          window.DisplayCutout.setDisplayCutout(
            window.DisplayCutout.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES,
            resolve,
            reject
          )
        })
    : () => Promise.resolve()

  await configureDisplayCutout().catch((err) => debugWarn('DisplayCutout error: ', err))
  // Mobile: NOTE: for some reason we NEED to also retrieve! the displayCutout size,
  // otherwise it will not affect correctly??
  // await updateGlobalDisplayCutoutAfterSet()

  window?.screen?.orientation?.lock('landscape').catch(noop)

  // const scaleFactor = !IS_PHONE_OR_ELECTRON && !IS_MOCKED_PHONE ? 16 / 9 : getScreenRatio()

  const canvas = getGameCanvas()
  canvas.onscroll = (ev) => ev.preventDefault() // FIX THE SLIGHT-SCROLLING OF CANVAS BUG (we need the canvas be fullscreen)

  // const refreshRate = await getDeviceRefreshRate()
  // setGlobalVar('__FPS', refreshRate)
  // debugLog('FPS TO USE (refresh rate)', refreshRate)

  const config: Phaser.Types.Core.GameConfig = {
    title: '~~ ~~',
    type: Phaser.WEBGL,
    backgroundColor: '#ffffff', // Could be black too
    pixelArt: false,
    transparent: false,

    width: getScreenDprWidth(),
    height: getScreenDprHeight(),
    // width: Math.min(1920 / DPR, getScreenDprWidth()),
    // height: Math.min(1080 / DPR, getScreenDprHeight()),

    render: {},
    scale: { mode: Phaser.Scale.ScaleModes.FIT },
    scene: [BootScene, BackgroundScene, ForegroundScene],
    canvas,
    dom: {
      createContainer: true,
    },
    physics: {
      default: 'matter',
      matter: {
        debug: true,
        // debug: {
        //   showBounds: true,
        //   showCollisions: true,
        //   showBody: true,
        //   // NOTE:CONFIG - the 'oreol' no matter what the alpha is!
        //   lineColor: 'blue',
        //   showPositions: false,
        //   // positionColor
        // },
        gravity: { y: 0, x: 0 }, // scale: 0.0001 },
        // HIGHER-MOITOR-REFRESH-RATE-ISSUES:SOLVED: have autoUpdate: false, fps: 60 and .step:
        autoUpdate: true,

        /// HIGHER-MOITOR-REFRESH-RATE-ISSUES:SOLVED - keep the 3 variables unset (keep default: 2) - higher
        /// could make the simulation different on higher refresh rate
        // NO: positionIterations: 10,
        // NO: velocityIterations: 10,
        // NO: constraintIterations: 10,

        runner: {
          // HIGHER-MOITOR-REFRESH-RATE-ISSUES:SOLVED: have autoUpdate: false, fps: 60 (but can be lower) and .step:
          isFixed: true,
          fps: 60, // 60, // MUST BE LOCKED to work properly;
        },
      } as IMatterWorldConfig,
    },
    // pipeline: { HueRotatePostFX },
    plugins: {
      scene: [
        // {
        //   key: 'rexGestures',
        //   plugin: GesturesPlugin,
        //   mapping: 'rexGestures',
        // },
        // {
        //   key: 'rexUI',
        //   plugin: RexUIPlugin,
        //   mapping: 'rexUI',
        // },
        // {
        //   key: 'rexModal',
        //   plugin: RexModalPlugin,
        //   mapping: 'rexModal',
        // },
      ],
    },
  }

  const game = new Game(config)

  // TODO:ALE:000 - check env editor (from webpack).. see how to do it;
  // waitMs(1000).then(() => {
  //   initializeEditor(game)
  // })
}

// when a browser game! ::
// onDeviceReady() // NOTE: this is for testing in Chrome when we do server the project

// document.documentElement.requestFullscreen()

if (IS_MOCKED_PHONE) {
  onDeviceReady()
}

if (IS_PHONE) {
  const waitForDeviceReady = () => {
    return new Promise((resolve) => document.addEventListener('deviceready', resolve, false))
  }

  Promise.all([
    /* waitForElectronReadyEvent(), */
    waitForDeviceReady(),
  ]).then(onDeviceReady)
} else {
  // ELECTRON / web
  onDeviceReady()
}
