import { ISceneWithRexGestures, SceneWithRexUI, Text } from '~/common/types'
import { createObservableScene } from './BaseObservableScene'

export const BackgroundScene = createObservableScene({
  key: 'BACKGROUND_SCENE',
  createObservers: (scene: SceneWithRexUI & ISceneWithRexGestures) => [
    // initBackgroundSetter(scene),
  ],
})

export default BackgroundScene
