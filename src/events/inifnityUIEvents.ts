import { constructEvents, IEvent } from './event'

type TInfinityUIEventName =
  | 'INF_UI_CONTROLS_SHOW'
  | 'INF_UI_CONTROLS_HIDE'
  | 'INF_UI_CONTROLS_BUTTON_CLICK'
  | 'INF_UI_TOGGLE_INNER_UI_ON'
  | 'INF_UI_TOGGLE_INNER_UI_OFF'
  | 'INF_UI_REQUEST_TOGGLE_INNER_LAYER_VISIBILITY'

export interface IInfinityUIEvent extends IEvent {
  name: TInfinityUIEventName
}

// note: re-typing the input `name` so that its fixed to TInfinityEventName
const _constructEvents: (
  events: Array<IInfinityUIEvent['name'] | IInfinityUIEvent>
) => Record<IInfinityUIEvent['name'], IInfinityUIEvent> = constructEvents as any

export const infinityUIEvents = _constructEvents([
  'INF_UI_CONTROLS_SHOW',
  'INF_UI_CONTROLS_HIDE',
  'INF_UI_CONTROLS_BUTTON_CLICK',
  'INF_UI_TOGGLE_INNER_UI_ON',
  'INF_UI_TOGGLE_INNER_UI_OFF',
  'INF_UI_REQUEST_TOGGLE_INNER_LAYER_VISIBILITY',
])
