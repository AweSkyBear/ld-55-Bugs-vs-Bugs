import { constructEvents } from 'obs-disp'

export const events = constructEvents([
  'LD_GAME_START',
  'LD_GAME_ENDED',
  'LD_CROSSHAIR_COUNT_REACHED',
  'LD_SPACEBAR_PULSATE_START',
  'LD_SPACEBAR_PULSATES',
  'LD_PLAYER_SUMMON',
  'LD_PLAYER_SUMMON_ENDED',
  /** When a minute passes with the timer after game start */
  'LD_TIMER_MINUTE_PASS',
  'LD_TIMER_HALF_MINUTE_PASS',
  /** A trigger for the bug to reproduce */
  'LD_REPROD_ME',
  /** A signal that a bug reproduced */
  'LD_BUG_REPRODUCED',
  /** A signal to a given crosshair to summon a bug */
  'LD_SUMMON_BUGS_ON_ME',
  /** For the total number of bugs to summon along all targets (when Space) */
  'LD_SUMMON_SET_COUNT',
  /** For when ending a summoning */
  'LD_EARTH_DECREASE_HP',
  /** For when unsummoning */
  'LD_EARTH_INCREASE_HP',
  /** When Earth loses HP */
  'LD_EARTH_HIT',
  'LD_ENEMY_BUG_KILLED',
  /** Brings the total number of points as well as the change (count) */
  'LD_POINTS_CHANGED',
  /** Unsummoning action */
  'LD_DO_UNSUMMON',
  /** Crosshair cleared */
  'LD_CROSSHAIR_REMOVED',
  /** Game lost */
  'LD_GAME_LOST',
])
