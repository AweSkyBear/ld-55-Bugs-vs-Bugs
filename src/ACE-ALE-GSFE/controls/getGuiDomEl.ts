import { basedOn } from '~/common/func'

export const getGuiDomEl = (gui: 'editing-entity') =>
  basedOn<typeof gui>({
    'editing-entity': () => document.querySelector('gui-editing-entity'),
  })
