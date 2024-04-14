import { constructEvents, IEvent } from './event'

type TDialogEventName =
  | 'DIALOG_TOGGLE_RANDOMIZER'
  | 'DIALOG_TOGGLE_UNLOCK_ALL'
  | 'DIALOG_TOGGLE_PAN_SETTINGS'
  // | 'GLOBAL_PINCH'

export interface IDialogEvent extends IEvent {
  name: TDialogEventName
}

// note: re-typing the input `name` so that its fixed to TDIALOGEventName
const _constructEvents: (
  events: Array<IDialogEvent['name'] | IDialogEvent>
) => Record<IDialogEvent['name'], IDialogEvent> = constructEvents as any

export const dialogEvents = _constructEvents([
  'DIALOG_TOGGLE_RANDOMIZER',
  'DIALOG_TOGGLE_UNLOCK_ALL',
  'DIALOG_TOGGLE_PAN_SETTINGS'
])
