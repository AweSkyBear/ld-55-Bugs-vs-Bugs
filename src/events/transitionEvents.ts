import { constructEvents, IEvent } from './event'

type TTransitionEventName =
  | 'LEVEL_START'
  // SHOWCASE_SET ?
  | 'NEBULAE_DIVE_IN'

export interface ITransitionEvent extends IEvent {
  name: TTransitionEventName
}

// note: re-typing the input `name` so that its fixed to TTransitionEventName
const _constructEvents: (
  events: Array<ITransitionEvent['name'] | ITransitionEvent>
) => Record<ITransitionEvent['name'], ITransitionEvent> = constructEvents as any

export const transitionEvents = _constructEvents([
  'LEVEL_START',
  'NEBULAE_DIVE_IN'
])
