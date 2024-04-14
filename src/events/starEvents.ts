import { constructEvents, IEvent } from './event'

type TStarEvent =
  | 'STAR_CREATE'
  | 'STAR_CREATED'

export interface IStarEvent extends IEvent {
  name: TStarEvent
}

// note: re-typing the input `name` so that its fixed to TStarEvent
const constructStarEvents: (
  events: Array<IStarEvent['name'] | IStarEvent>
) => Record<IStarEvent['name'], IStarEvent> = constructEvents as any

export const starEvents = constructStarEvents([
  'STAR_CREATED',
  'STAR_CREATE'
])
