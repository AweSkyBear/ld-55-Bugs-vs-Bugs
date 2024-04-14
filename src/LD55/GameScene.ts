import { IObserver, removeObs } from '~/OD'
import { createObservableScene } from '~/scenes/BaseObservableScene'
import { ISceneWithRexGestures, SceneWithRexUI } from '../common/types'
import { initConfigWorld } from '~/core/ConfigWorld'
import { initInputDispatcherObserver } from '~/core/InputDispatcherObserver'
import { createPlane } from '~/game/airbornDelivery/createPlane'
import { createLD55Game } from '~/LD55/createLD55Game'
import { createBackground } from '~/LD55/createBackground'
import { createHTMLEvents } from '~/core/createHTMLEvents'
import { createCamera } from '~/core/createCamera'
import { createCrate } from '~/game/airbornDelivery/createCrate'
import { exposeToWindow } from '../common/debug'
import { defer } from '../common/func'
import { createLevel } from '~/game/airbornDelivery/createLevel'
import { createDetectGameWin } from '~/game/airbornDelivery/createDetectGameWin'
import { createScreenBeforeGame } from '~/game/airbornDelivery/createScreenBeforeGame'
import { createScreenSwitcher } from '~/game/airbornDelivery/createScreenSwitcher'
import { createDetectGameLose } from '~/game/airbornDelivery/createDetectGameLose'
import { createExit } from '~/game/airbornDelivery/createExit'
import { registerPipelines } from '~/scenes/common'
import { TEXTURES_MAP } from '~/textures/textures'
import { createSoundFX } from '~/common/createSoundFX'

let gameSceneObservers: IObserver[] = []
let recreateObservers: Function = null

exposeToWindow({
  resetGame: () => {
    gameSceneObservers.forEach((o) => removeObs(o))
    gameSceneObservers = []

    defer(() => recreateObservers(), 100)
  },
})

export const Game = createObservableScene({
  key: 'GAME_SCENE',
  createObservers: (scene: SceneWithRexUI & ISceneWithRexGestures) => {
    recreateObservers = () => [
      initInputDispatcherObserver()(scene),
      initConfigWorld(scene),

      createBackground(),

      createLD55Game(),

      // createCrate(),

      // createLevel(),

      // // misc
      // createDetectGameWin(),
      // createDetectGameLose(),
      // createScreenSwitcher(),
      // createScreenBeforeGame(),
      // createExit(),
      // // createPause(), // in FOREGROUND

      // core
      createHTMLEvents({}),

      createSoundFX(),

      // ?
      createCamera(),

      // createPlane(),
    ]

    // console.log('recreateObservers')
    // if (gameSceneObservers.length === 0)
    gameSceneObservers = recreateObservers()

    return gameSceneObservers
  },
  // onPreload: (scene) => {

  // },
  onPreload: (scene) => {
    // scene.input.setDefaultCursor('url(' + cursorsB64.inMenu + '), pointer')
    // scene.load.setBaseURL('http://localhost:3031')
    /////// FAILING NOW, WHY ?
    // scene.load.setBaseURL('http://labs.phaser.io')
    // scene.load.image(TEXTURES_MAP.BIRD_SPAWNER_1, 'assets/skies/space3.png'
    // scene.load.image({
    //   key: TEXTURES_MAP.BIRD_SPAWNER_1,
    //   url: '/assets/bird/bird-spawner1.png',
    // })
  },
  onCreate: (scene) => {},
})

export default Game
