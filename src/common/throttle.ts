import { throttle as _throttle, debounce } from 'throttle-debounce'
import { Func } from './types'

export const throttle = <TCallbackArgs extends any[]>(
  ms: number,
  callback: (...args: TCallbackArgs) => void,
  opts?: { noLeading?: boolean; noTrailing?: boolean; debounceMode?: boolean }
) => {
  return _throttle(ms, callback, opts) as Func<TCallbackArgs, void>
}

export { debounce }

export default throttle
