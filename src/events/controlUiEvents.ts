import { constructEvents, IEvent } from './event'

type TControlUIEventName =
  | 'CTRL_UI_CONTROLS_SHOW'
  | 'CTRL_UI_CONTROLS_HIDE'
  | 'CTRL_UI_CONTROLS_BUTTON_CLICK'
  | 'CTRL_UI_BUTTON_CLICK'
  | 'CTRL_UI_TOGGLE_INNER_UI_ON'
  | 'CTRL_UI_TOGGLE_INNER_UI_OFF'
  | 'CTRL_UI_REQUEST_TOGGLE_INNER_LAYER_VISIBILITY'

export interface IControlUIEvent extends IEvent {
  name: TControlUIEventName
}

// note: re-typing the input `name` so that its fixed to TInfinityEventName
const _constructEvents: (
  events: Array<IControlUIEvent['name'] | IControlUIEvent>
) => Record<IControlUIEvent['name'], IControlUIEvent> = constructEvents as any

export const controlUIEvents = _constructEvents([
  'CTRL_UI_CONTROLS_SHOW', // ?
  'CTRL_UI_CONTROLS_HIDE', // ?
  'CTRL_UI_CONTROLS_BUTTON_CLICK',
  'CTRL_UI_BUTTON_CLICK',

  'CTRL_UI_TOGGLE_INNER_UI_ON',
  'CTRL_UI_TOGGLE_INNER_UI_OFF',
  'CTRL_UI_REQUEST_TOGGLE_INNER_LAYER_VISIBILITY',
])

export interface IControlUiEvent extends IEvent {
  payload: { infBgTexture: string }
}
