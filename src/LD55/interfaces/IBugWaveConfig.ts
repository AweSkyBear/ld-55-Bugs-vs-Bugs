import { TBugSize } from './TBugSize'

export interface IBugWaveConfig {
  initialCount: number
  reprodStartAfterS?: number
  populReproductionPct: number
  reprodSpawnCount: number
  bugSize: TBugSize
}
