import { constructEvents, IEvent } from './event'

type TInfinityEventName = 'BACKGROUND_CHANGE'

export interface IInfinityEvent extends IEvent {
  name: TInfinityEventName
}

// note: re-typing the input `name` so that its fixed to TInfinityEventName
const _constructEvents: (
  events: Array<IInfinityEvent['name'] | IInfinityEvent>
) => Record<IInfinityEvent['name'], IInfinityEvent> = constructEvents as any

export const infinityEvents = _constructEvents([ 'BACKGROUND_CHANGE' ])
