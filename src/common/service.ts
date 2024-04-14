import { defaultTo, omit, repeat } from 'ramda'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { getGameScene } from '~/scenes/common'
import { debugLog, exposeToWindow } from './debug'
import { callAll, waitMs } from './func'
import { Easing, Func, NumberTweenBuilderConfig, Tween } from './types'

export const createRepeatUntilCountService = (
  opts: Partial<{
    /** Either this or @fnNextLoopArray must be defined */
    fn?: Func<never, void> // Phaser.Types.Tweens.TweenOnUpdateCallback, // Func<never, void>,
    /**
     * Either this or @fn must be defined
     * This defines the callback for Each consecutive run of the service
     * (when the whole thing runs once)
     */
    fnNextLoopArray?: Func<never, void>[]
    elementCount: number
    tickDelayMS: number
    repeatDelayMS: number
    repeatCount: number
    /** Can override any prop of the tween from here */
    onComplete: Phaser.Types.Tweens.TweenOnCompleteCallback
    tweenProps: Omit<NumberTweenBuilderConfig, 'onComplete'>
  }>
) => {
  let currentCountInd = 0,
    totalCount = 0
  let tween = null as Tween

  const configAndStart = (config: typeof opts) => {
    const { elementCount, tickDelayMS, repeatCount, repeatDelayMS, tweenProps, onComplete, fn } =
      config

    const onRestart = () => {
      currentCountInd = 0
      // tween.seek(0)
    }

    const tween = ObservableScenes.game.tweens.addCounter({
      from: 0,
      to: elementCount,
      ease: Easing.Linear,
      duration: tickDelayMS * elementCount,
      repeatDelay: repeatDelayMS,
      repeat: repeatCount > 0 ? repeatCount - 1 : repeatCount,
      onStart: onRestart,
      onUpdate: (tween: Tween, params: { value: number }) => {
        const tweenProgres = params.value
        if (
          // FIX:EDGECASE - totalCount < elementCount * repeatCount // one more element than needed
          totalCount < elementCount * repeatCount &&
          parseInt(tweenProgres as any) >= currentCountInd
        ) {
          // debugLog(
          //   'tweenProrgress',
          //   parseInt(tweenProgres as any),
          //   tweenProgres,
          //   'currentInd',
          //   currentCountInd
          // )
          currentCountInd++
          totalCount++
          // debugLog(`totalCount`, totalCount)
          fn()
        }
      },
      onComplete: callAll(onRestart, onComplete as any),
      onRepeat: onRestart,
      ...omit(['onComplete'], tweenProps),
    })

    return tween
  }

  // TODO: return a wrapper that has .reset seek(0)
  const result = {
    tween: (() => {
      return (tween = configAndStart(opts))
    })(),
    reconfigAndRestart: (config: { optOverrides: typeof opts }) => {
      {
        tween && tween.remove()
        tween = configAndStart(Object.assign({}, opts, config.optOverrides))

        totalCount = 0

        return result
      }
    },
    destroy: () => result.tween,
  }

  return result
}

exposeToWindow({ createRepeatUntilCountService })

export const createConditionMetService = (
  predicate: Func<never, boolean>,
  opts: { delay?: number; repeat?: number } = { delay: 1000, repeat: 1 }
  // TODO: option for if to continue after ones met - for now only ones
) => {
  const _state = { _count: 0, forceHalt: false, onMetCbs: [] as Func<never, void>[] }
  const checker = () => {
    if (_state.forceHalt) return
    if (predicate()) {
      _state._count++
      callAll(..._state.onMetCbs)()

      if (_state._count >= defaultTo(1, opts.repeat)) {
        result.kill()
        return
      }
      // _state.onMetCbs = null
    }

    setTimeout(() => {
      checker()
    }, defaultTo(1000, opts.delay))
  }
  const result = {
    start: () => {
      checker()
      return result
    },
    kill: () => {
      _state.forceHalt = true
      return result
    },
    onMet: (callback: Func<never, void>) => {
      // { start: Func<never, void>, kill: Func<never, void>}
      // callback()
      _state.onMetCbs.push(callback)
      return result
    },
    restart: () => {
      _state.forceHalt = false
      _state._count = 0
      checker()
    },
  }

  return result
}

createConditionMetService(() => {
  return false
}).onMet(() => {})

export interface IThrottledService extends ReturnType<typeof createThrottledService> {}

export const createThrottledService = <T extends any[]>(fn: Func<T, void>, minMs: number) => {
  let _fn = fn
  const _state = {
    canExec: true,
    timeout: null as NodeJS.Timeout | null,
  }

  const result = {
    /** Will only invoke if minMs has passed from the last invocation */
    try: (...args: T) => {
      if (_state.canExec) {
        _fn.apply(null, [{ canExec: _state.canExec }, ...args] as any)

        _state.canExec = false
      } else if (_state.timeout === null) {
        _state.timeout = setTimeout(() => {
          // make sure the timeout can be tracked - did it finish?
          _state.timeout = null
          _state.canExec = true
        }, minMs)
      }
    },
    setFn: (fn: Func<T, void>) => (_fn = fn),
  }

  return result
}
