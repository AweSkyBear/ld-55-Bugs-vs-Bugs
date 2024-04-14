import { constructEvents, IEvent } from './event'

type TControlEventName =
  | 'CONTROL_DOWN_STEER_RIGHT'
  | 'CONTROL_UP_STEER_RIGHT'
  | 'CONTROL_DOWN_STEER_LEFT'
  | 'CONTROL_UP_STEER_LEFT'
  | 'CONTROL_STEER_UP'
  | 'CONTROL_STEER_DOWN'
  | 'CONTROL_UP_DOWN'
  | 'CONTROL_UP_UP'
  | 'CONTROL_DOWN_UP'
  | 'CONTROL_DOWN_DOWN'
  | 'CONTROL_DOWN_OVERVIEW'
  //
  | 'CONTROL_CLICK_RESTART'
  | 'CONTROL_CLICK_DOWN'
  | 'CONTROL_CLICK_UP'

export interface IControlEvent extends IEvent {
  name: TControlEventName
}

// note: re-typing the input `name` so that its fixed to TControlEventName
const _constructEvents: (
  events: Array<IControlEvent['name'] | IControlEvent>
) => Record<IControlEvent['name'], IControlEvent> = constructEvents as any

export const controlEvents = _constructEvents([
  'CONTROL_CLICK_RESTART',

  'CONTROL_DOWN_STEER_RIGHT',
  'CONTROL_UP_STEER_RIGHT',
  'CONTROL_DOWN_STEER_LEFT',
  'CONTROL_UP_STEER_LEFT',

  'CONTROL_UP_DOWN',
  'CONTROL_UP_UP',
  'CONTROL_DOWN_UP',
  'CONTROL_DOWN_DOWN',
  
  'CONTROL_STEER_UP',
  'CONTROL_STEER_DOWN',

  'CONTROL_DOWN_OVERVIEW',

  'CONTROL_CLICK_DOWN',
  'CONTROL_CLICK_UP',
])
