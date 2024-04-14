import { pathOr } from 'ramda'
import { noop } from './func'
import { Func } from './types'

const _getCordovaDisplayCutout = () => (window as any).DisplayCutout

export let DISPLAY_CUTOUT = null

export const updateGlobalDisplayCutoutAfterSet = () => {
  const DisplayCutout = _getCordovaDisplayCutout()
  if (!DisplayCutout) return

  return new Promise((resolve, reject) =>
    DisplayCutout.getDisplayCutout((val) => {
      DISPLAY_CUTOUT = val
      resolve(val)
    }, reject)
  )
}

const getDisplayCutout = () => {
  const DisplayCutout = _getCordovaDisplayCutout()
  if (!DisplayCutout) return
  if (!DisplayCutout) return {}

  let result: any
  DisplayCutout.getDisplayCutout((val) => (result = val))
  return result
}

// export const configureDisplayCutout = _getCordovaDisplayCutout()
//   ? () =>
//       new Promise<void>((resolve, reject) => {
//         _getCordovaDisplayCutout().setDisplayCutout(
//           _getCordovaDisplayCutout().LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES,
//           resolve(),
//           reject()
//         )
//       })
//   : (noop as Func<never, Promise<void>>)

// NOTE: if at any point we also have protrait view, this has to check other props as well!
export const getDisplayCutoutSize = (): number => pathOr(0, ['left'])(DISPLAY_CUTOUT)
