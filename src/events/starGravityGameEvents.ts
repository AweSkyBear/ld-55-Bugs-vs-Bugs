import { constructEvents, IEvent } from './event'

type TStarGravityGameEventName =
  | 'STAR_GRAVITY_GAME_BEFORE_START'
  | 'STAR_GRAVITY_GAME_START'
  | 'STAR_GRAVITY_GAME_RESET'
  | 'STAR_GRAVITY_GAME_ЕND'
  | 'STAR_GRAVITY_GAME_ZOOMED_BACK'

export interface IStarGravityGameEvent extends IEvent {
  name: TStarGravityGameEventName
}

// note: re-typing the input `name` so that its fixed to TStarGravityGameEventName
const _constructEvents: (
  events: Array<IStarGravityGameEvent['name'] | IStarGravityGameEvent>
) => Record<IStarGravityGameEvent['name'], IStarGravityGameEvent> = constructEvents as any

export const starGravityGameEvents = _constructEvents([
  'STAR_GRAVITY_GAME_BEFORE_START',
  'STAR_GRAVITY_GAME_START',
  'STAR_GRAVITY_GAME_ЕND',
  'STAR_GRAVITY_GAME_RESET',
  'STAR_GRAVITY_GAME_ZOOMED_BACK',
])
