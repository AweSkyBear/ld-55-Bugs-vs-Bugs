import { defaultTo } from 'ramda'
import { isFunction } from './func'
import { getMonitorRefreshRate } from './screen'
import { Func } from './types'

const isDevelopment = process.env.NODE_ENV !== 'production'

const onlyIfDevelopment =
  <T extends any[]>(fn: (...args: T) => any, elseFn?: (...args: T) => any /* Func<any, any> */) =>
  (...args: T) =>
    (isDevelopment && fn(...(args as any))) || (elseFn && elseFn(...(args as any)))

export const happenAfterS = (cb: Func<any, any>, seconds: number = 1) => {
  setTimeout(cb, seconds * 1000)
}
export const debugLog = onlyIfDevelopment(console.log)
export const debugWarn = onlyIfDevelopment(console.warn)
export const debugInfo = onlyIfDevelopment(console.info)
export const debugError = onlyIfDevelopment(console.error)
export const debugNotImplemented = onlyIfDevelopment(
  console.error.bind(null, '! NOT IMPLEMENTED !')
)

export const setGlobalVar = onlyIfDevelopment(<T>(nameOrFn: string | Function, val?: T) => {
  if (isFunction(nameOrFn)) {
    ;(window as any)[(nameOrFn as Function).name] = nameOrFn
  } else {
    ;(window as any)[nameOrFn as string] = val
  }
})

/**
 * A debug function which will return the window[windowVarName] once we assign it
 * a value (and will fetch the value from the window each time). This gives us
 * the chance to supply values in the F12 dev tools via window[windowVarName]
 *
 * Note: the first assignment of the value is the original value passed
 * @param windowVarName
 * @param actualValue The value, preferably a constant, like a configuration variable.
 * This will be assigned only once (the first time) to the windowVarName (window variable)
 * @returns
 */
export const useDebugConstant = onlyIfDevelopment(
  (windowVarName: string, actualValue: any) => {
    const _windowDataKey = 'EXPOSED_DEBUG_VARS'
    window[_windowDataKey] = defaultTo({}, window[_windowDataKey])
    const hasBeenAssignedOnce = Boolean(window[_windowDataKey][windowVarName])
    if (!hasBeenAssignedOnce) {
      setGlobalVar(windowVarName, actualValue)
      window[_windowDataKey][windowVarName] = window[_windowDataKey][windowVarName] || {
        // first-time-assignment value
        firstValue: actualValue,
        resetValue: () => setGlobalVar(windowVarName, window[_windowDataKey].firstValue),
        // TODO:FEAT - later, store to local storage for "automatic-save" (then load from there)?
      }
      window[_windowDataKey][windowVarName].firstValue = actualValue
    }

    return getGlobalVar(windowVarName) || actualValue
  },
  // if not in dev mode, simply return the value as-is
  (_windowVarName: string, actualValue: any) => actualValue
)

export const getGlobalVar = <T>(name: string) => (window as any)[name] as T
export const logGlobalVar = onlyIfDevelopment((name: string, prefix?: string) =>
  console.log(prefix, getGlobalVar(name))
)
declare const window: {
  __EXPOSED: Record<string, any>
}

export const exposeToWindow = (varObj: any) => {
  if (process.env.NODE_ENV === 'production') return

  const result = Object.keys(varObj).map((key) => {
    const value = varObj[key]
    window[key] = value
    window.__EXPOSED = window.__EXPOSED || {}
    window.__EXPOSED[key] = value

    return [key, value]
  })

  return result
}

export const createFpsCounter = onlyIfDevelopment(() => {
  if (document.getElementById('fpsCounter')) {
    return
  }

  const el = document.createElement('div')
  el.setAttribute('id', 'fpsCounter')
  el.style.position = 'absolute'
  document.body.appendChild(el)

  setInterval(() => {
    getMonitorRefreshRate().then((fps: number) => {
      // console.log('FPS', fps.toFixed(2))
      setGlobalVar('__FPS', fps)
      el.innerText = 'FPS:' + fps.toFixed(2)
    })
  }, 1000)
})

export const destroyFPSCounter = onlyIfDevelopment(() => {
  document.getElementById('fpsCounter').remove()
})

// export const writeOutEverySAndClearConsole = (cb, ...args) => {
//   console.clear()
//   setInterval(() => {
//     debugLog(cb(...args))
//     writeOutEverySAndClearConsole(cb, ...args)
//   }, 1000)
// }
