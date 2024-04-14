import { constructEvents, IEvent } from './event'

type TPremiumEventName =
  | 'PREMIUM_REQUEST_UNLOCK'
  | 'PREMIUM_DO_UNLOCK'

export interface IPremiumEvent extends IEvent {
  name: TPremiumEventName
}

// note: re-typing the input `name` so that its fixed to TPremiumEventName
const _constructEvents: (
  events: Array<IPremiumEvent['name'] | IPremiumEvent>
) => Record<IPremiumEvent['name'], IPremiumEvent> = constructEvents as any

export const premiumEvents = _constructEvents([
  'PREMIUM_REQUEST_UNLOCK',
  'PREMIUM_DO_UNLOCK'
])
