import { DeepPartial } from './types'

export const findOrAddEl = (
  conf: { selector?; parent?; elClass; elTag? } & DeepPartial<HTMLElement>
) => {
  const parent = conf.parent || document.body

  return (
    parent.querySelector(conf.selector || `.${conf.elClass}`) ||
    parent.appendChild(
      (() => {
        const el = document.createElement(conf.elTag || 'div')
        el.className = conf.elClass

        conf.innerHTML && (el.innerHTML = conf.innerHTML)
        _removeObsProps(['parent', 'elClass', 'elTag'], conf)

        Object.assign(el, conf) // pass the rest of HTMLElement params

        return el
      })()
    )
  )
}

const _removeObsProps = (props, obj) => props.forEach((p) => delete obj[p])
