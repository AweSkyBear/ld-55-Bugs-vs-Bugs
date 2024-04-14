// TO BE UPDATED UPON NEW EVENTS FILE
// (used by the GameEngineObserver)
import { mergeAll } from '~/common/func'
import { collisionEvents } from './collisionEvents'
import { controlEvents } from './controlEvents'
import { cutsceneEvents } from './cutsceneEvents'
import { gameEvents } from './gameEvents'
import { inputEvents } from './inputEvents'
import { sceneEvents } from './sceneEvents'

export default mergeAll([
  gameEvents,
  inputEvents,
  sceneEvents,
  cutsceneEvents,
  controlEvents,
  collisionEvents,
])
