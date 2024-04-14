import { constructEvents, IEvent } from './event'

type TInputEventName =
  | 'LEVEL_START'
  // | 'GLOBAL_PINCH'

export interface IInputEvent extends IEvent {
  name: TInputEventName
}

// note: re-typing the input `name` so that its fixed to TInputEventName
const _constructEvents: (
  events: Array<IInputEvent['name'] | IInputEvent>
) => Record<IInputEvent['name'], IInputEvent> = constructEvents as any

export const gameEvents = _constructEvents([
  'LEVEL_START',
])
