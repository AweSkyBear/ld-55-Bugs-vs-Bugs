import { constructEvents, IEvent } from './event'

type TEditingEventName =
  | 'EDIT_MODE_TOGGLE'

export interface IEditingEvent extends IEvent {
  name: TEditingEventName
}

// note: re-typing the input `name` so that its fixed to TEditingEventName
const _constructEvents: (
  events: Array<IEditingEvent['name'] | IEditingEvent>
) => Record<IEditingEvent['name'], IEditingEvent> = constructEvents as any

export const editingEvents = _constructEvents([
  'EDIT_MODE_TOGGLE',
])
