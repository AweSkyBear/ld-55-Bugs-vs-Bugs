import { constructEvents, IEvent } from './event'

type TCollisionEventName =
  | 'COLLISION_PLR_HIT'
  | 'COLLISION_PLR_PARACHUTE_HIT'
  // novel events
  | 'COLLISION_PLAYER_AND_ENEMY'
  | 'COLLISION_PLAYER-FIRE_AND_ENEMY'
  | 'COLLISION_PLAYER_AND_ENEMY-PROJECTILE'
  | 'COLLISION_ENEMY_AND_OBSTACLE'
  | 'COLLISION_PLAYER_AND_LOOT'

export interface ICollisionEvent extends IEvent {
  name: TCollisionEventName
}

// note: re-typing the input `name` so that its fixed to TCollisionEventName
const _constructEvents: (
  events: Array<ICollisionEvent['name'] | ICollisionEvent>
) => Record<ICollisionEvent['name'], ICollisionEvent> = constructEvents as any

export const collisionEvents = _constructEvents([
  'COLLISION_PLR_HIT',
  'COLLISION_PLR_PARACHUTE_HIT',
  'COLLISION_PLAYER_AND_ENEMY',
  'COLLISION_PLAYER-FIRE_AND_ENEMY',
  'COLLISION_PLAYER_AND_ENEMY-PROJECTILE',
  'COLLISION_ENEMY_AND_OBSTACLE',
  'COLLISION_PLAYER_AND_LOOT',
])
