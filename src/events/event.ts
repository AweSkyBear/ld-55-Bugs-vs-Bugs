import { identity, ifElse, map, prop } from 'ramda'
import { Scene } from '../common/types'

export interface IEvent {
  name: string
  payload?: any
}

export const handleEvent = (
  ev: IEvent,
  eventHandlerMap: Record<IEvent['name'], (ev: IEvent) => void>
) => {
  const fn = eventHandlerMap[ev.name]
  return fn && fn(ev)
}

const constructEventFromName = (name: IEvent['name']) => ({ name })

export const constructEvents = (events: Array<IEvent['name'] | IEvent>) => {
  const isFullEvent = (evOrName) => typeof evOrName !== 'object'
  const evs = map(ifElse(isFullEvent, constructEventFromName, identity), events)
  const keys = map(ifElse(isFullEvent, identity, prop('name')), events)
  return evs.reduce((accum, ev, ind) => {
    accum[keys[ind]] = ev
    return accum
  }, {}) as Record<IEvent['name'], IEvent>
}

export interface IEventWithPayload<T> {
  name: IEvent['name']
  payload: T
}
