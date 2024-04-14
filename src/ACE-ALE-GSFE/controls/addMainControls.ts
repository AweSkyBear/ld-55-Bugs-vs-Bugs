import { clipboard } from 'electron'
import { findOrAddEl } from '../common/findOrAddEl'
import { getEditorInstance } from '../_new/global/editorInstance'
import { plugEditor } from '../plugEditor'
import { exposeToWindow } from '~/common/debug'

export const _editorRootEl = findOrAddEl({ elClass: 'use-editor' })

const addButton = (config: { id: string; innerHTML: string }) => {
  const btn = findOrAddEl({
    parent: _editorRootEl,
    selector: `.${config.id}`,
    elClass: `${config.id} ale-btn`,
    elTag: 'button',
    id: config.id,
    innerHTML: config.innerHTML,
  })

  return btn
}

// TODO:ALE:1 - make use of
export const addMainControls = (editorConfig: Parameters<typeof plugEditor>[0]) => {
  const controls = [
    // addButton({
    //   id: 'avail-functions-objs',
    //   innerHTML: 'Def Entity Function',
    // }).addEventListener('click', () => {
    //   console.log('click avail-functions-objs', Object.keys(editorConfig.entityFunctions))
    // }),
    addButton({
      id: 'copy-level-entities',
      innerHTML: 'Copy Level Config',
    }).addEventListener('click', () => {
      // note: requires a secure origin / localhost
      navigator.clipboard.writeText(JSON.stringify(getEditorInstance().getAllEntities(), null, 2))
      ;(window as any).levelConfig = getEditorInstance().getAllEntities()

      // TODO:ALE:L list them as this to be a Select with the options? - by default, nothing is selected
    }),
    addButton({
      id: 'copy-build-run-code',
      innerHTML: 'Copy Level RUN Code',
    }).addEventListener('click', () => {
      alert('TODO')
    }),
  ]

  // if (!_initialized) {
  //   // initialize objects
  //   const scene = editorConfig.scene

  //   attachCanvasEvents({ scene })

  //   _initialized = true
  // }

  return controls
}
