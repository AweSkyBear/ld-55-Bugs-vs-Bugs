import { sendSceneToTop } from '~/common/scene'
import { ISceneWithRexGestures, SceneWithRexUI } from '~/common/types'
import { createInGameUI } from '~/game/airbornDelivery/createInGameUI'
import { createObservableScene } from './BaseObservableScene'
import { createBeforeGameLevelSelection } from '~/game/airbornDelivery/createBeforeGameLevelSelection'
import { createPause } from '~/game/airbornDelivery/createPause'
import { createRestart } from '~/game/airbornDelivery/createRestart'
import { createToasts } from '~/game/airbornDelivery/createToasts'

/** Use for UI / things that don't scroll with the game */
export const ForegroundScene = createObservableScene({
  key: 'FOREGROUND_SCENE',
  createObservers: (scene: SceneWithRexUI & ISceneWithRexGestures) => [
    // initControlsObserver(scene),

    createBeforeGameLevelSelection(),
    // TODO:LD - for when the game is played ?
    // createUIStartMenu(),
    createPause(),
    createRestart(),

    createToasts(),
    createInGameUI(),
  ],
  onCreate: (scene) => {
    sendSceneToTop(scene)
  },
})

export default ForegroundScene
