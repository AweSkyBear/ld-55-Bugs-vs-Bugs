import { constructEvents, IEvent } from './event'

type TCutsceEventName = 'CUTSCENE_DIALOGUE_START' | 'CUTSCENE_DIALOGUE_END'
// | 'GLOBAL_PINCH'

export interface TCutsceneEvent extends IEvent {
  name: TCutsceEventName
}

// note: re-typing the input `name` so that its fixed to TCutsceEventName
const _constructEvents: (
  events: Array<TCutsceneEvent['name'] | TCutsceneEvent>
) => Record<TCutsceneEvent['name'], TCutsceneEvent> = constructEvents as any

export const cutsceneEvents = _constructEvents([
  'CUTSCENE_DIALOGUE_START',
  'CUTSCENE_DIALOGUE_END',
])
