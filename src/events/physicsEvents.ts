import { constructEvents, IEvent } from './event'

type TPhysicsEventName =
  | 'PHYSICS_EVENTS_SET_PROP'
  // | 'GLOBAL_PINCH'

export interface IPhysicsEvent extends IEvent {
  name: TPhysicsEventName
}

export interface ISetPhysicsPropEvent extends IPhysicsEvent {
  name: TPhysicsEventName,
  payload: {
    field: string
    value: number
  }
}

// note: re-typing the input `name` so that its fixed to TPhysicsEventName
const _constructEvents: (
  events: Array<IPhysicsEvent['name'] | IPhysicsEvent>
) => Record<IPhysicsEvent['name'], IPhysicsEvent> = constructEvents as any

export const physicsEvents = _constructEvents([
  'PHYSICS_EVENTS_SET_PROP',
])
