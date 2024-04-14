import { constructEvents, IEvent } from './event'

type TShipEventName =
  | 'SHIP_MOVE'
  | 'SHIP_ROTATE'

export interface IShipEvent extends IEvent {
  name: TShipEventName
}

// note: re-typing the input `name` so that its fixed to TInputEventName
const _constructEvents: (
  events: Array<IShipEvent['name'] | IShipEvent>
) => Record<IShipEvent['name'], IShipEvent> = constructEvents as any

export const shipEvents = _constructEvents([
  'SHIP_MOVE',
  'SHIP_ROTATE',
])
