import { defer } from '../func'

export const unfocusElHack = (el: HTMLElement) => {
  el.setAttribute('disabled', 'true')
  defer(() => el.removeAttribute('disabled'))
}
