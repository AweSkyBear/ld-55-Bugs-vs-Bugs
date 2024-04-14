import { exposeToWindow } from '~/common/debug'

export enum COLLISION_CATEGORY {
  NONE = -1,
  /** Enemies can pass through it, but its not Sensor */
  Player = 2 ** 0,
  /** The Sensor version of Player; For detecting sensor collisions with enemies/projectiles */
  PlayerSensor = 2 ** 1,
  /** Collides with self but not with player / acts as sensor to it */
  Enemy = 2 ** 2,
  Ground = 2 ** 3,
  // to be ??:
  // CollidableEnemy = 2 ** 4, // to be?
  EjectArea = 2 ** 4,

  SelfCollidableSensorEnemy = 2 ** 5, // any point?
  PlayerProjectile = 2 ** 6,
  EnemyProjectile = 2 ** 7, // to be
  Loot = 2 ** 8,
}

exposeToWindow({ COLLISION_CATEGORY })
