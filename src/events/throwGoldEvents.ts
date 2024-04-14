import { constructEvents, IEvent } from './event'

type ITGEventName =
  | 'GOLD_BAR_CREATED'
  // | 'GLOBAL_PINCH'

export interface ITGEvent extends IEvent {
  name: ITGEventName
}

// note: re-typing the input `name` so that its fixed to ITGEventName
const _constructEvents: (
  events: Array<ITGEvent['name'] | ITGEvent>
) => Record<ITGEvent['name'], ITGEvent> = constructEvents as any

export const throwGoldEvents = _constructEvents([
  'GOLD_BAR_CREATED',
])
