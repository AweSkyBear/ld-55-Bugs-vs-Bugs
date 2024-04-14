import { constructEvents, IEvent } from './event'

type TInputEventName =
  | 'SENSOR_TAP'
  // | 'GLOBAL_PINCH'

export interface ISensorEvent extends IEvent {
  name: TInputEventName
}

// note: re-typing the input `name` so that its fixed to TInputEventName
const _constructEvents: (
  events: Array<ISensorEvent['name'] | ISensorEvent>
) => Record<ISensorEvent['name'], ISensorEvent> = constructEvents as any

export const sensorEvents = _constructEvents([
  'SENSOR_TAP',
])
