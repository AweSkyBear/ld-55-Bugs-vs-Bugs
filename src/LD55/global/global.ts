import Prando from 'prando'
import { exposeToWindow } from '~/common/debug'
import { defer } from '~/common/func'
import { getGamePrando } from '~/common/prandom'
import { ObservableScenes } from '~/scenes/BaseObservableScene'

export const Global = {
  earthPos: { x: 0, y: 0 },
  earthRadius: 100,
  // core state
  earthHp: 100,
  selectedSummonCountDefault: 3,
  selectedSummonCount: 3, // TODO: use everywhere ! ! !
  //
  baseGameZoom: 1,
  // State flags
  summonEnded: false,
  isEvery30thFrame: false,
  isEvery60thFrame: false,
  ignoreGlobalPointerDown: false,
  isUnsummoning: false,
  //
  timerS: 0,
  timerMin: 0,
  totalKills: 0,
  totalLostBugs: 0, // TODO:use
  totalBugsSummoned: 0,
  //
  prando: getGamePrando(),
  playMp3Sound: null as any,
}

exposeToWindow({ Global })

export const getTotalEnemyCount = () => {
  return ObservableScenes.game.children.getAll('name', 'bug-enemy').length
}

export const setTempIgnoreGlobalPointerDown = () => {
  Global.ignoreGlobalPointerDown = true
  defer(() => (Global.ignoreGlobalPointerDown = false))
}
