import { exposeToWindow } from '~/common/debug'
import { _editorRootEl } from './controls/addMainControls'
import { addMainControls } from './controls/addMainControls'
import { setEntityFunctions } from './_new/global/entityFunctions'

import './use-editor.css'

import { IUSEEditor, getEditorInstance, setEditorInstance } from './_new/global/editorInstance'
import { TCanvasMarker } from './common/types'
import { getAllEntities } from './_new/entityStore'
import { createEditor } from './_new/createEditor'

export type TEditorConfig = Parameters<typeof plugEditor>[0]

export const plugEditor = (config: {
  scene: Phaser.Scene
  exposedVariables?: Record<any, any>
  miscFunctions?: Record<any, Function>
  entityFunctions: Record<any, Function>

  propTypes: Record<string, any>
  onEditStop?: () => void // TODO:ALE:0: handle
  onEditStart?: () => void // TODO:ALE:0: handle
  onEntityAdd?: (entity: any, marker: TCanvasMarker) => void
  onEntityUpdate?: (entity: any, marker: TCanvasMarker, rerunCreate: () => void) => void
  onEntityRemove?: (entity: any, marker: TCanvasMarker) => void
  //TODO:ALE:3:L - provide ability to pass entityFunction-to-custom-properties map!
  // -> this way WE control what we'll be editing
}) => {
  createEditor(config)

  // addMainControls(config)

  return

  /// OLD CODE:
  if (getEditorInstance()) throw new Error('Editor already initialized / plugged in')

  const { entityFunctions, exposedVariables } = config

  const state = {
    isEditing: false,
  }

  setEntityFunctions(entityFunctions)

  // debug
  exposeToWindow({
    ALE: {
      entityFunctions,
      exposedVariables,
    },
  })

  const editor = {
    editStart: () => {
      if (state.isEditing) return

      addMainControls(config)
      state.isEditing = true
    },
    editStop: () => {
      if (!state.isEditing) return

      state.isEditing = false

      _editorRootEl.innerHTML = ''
      // TODO:ALE:L - remove event handlers (for keys?)
    },
    entityFunctions,
    onEntityAdd: config.onEntityAdd,
    onEntityUpdate: config.onEntityUpdate,
    onEntityRemove: config.onEntityRemove,
    getAllEntities: () => getAllEntities(config.scene),
    propTypes: config.propTypes,
  }

  setEditorInstance(editor)

  // qck & dirty: sync `levelConfig` var accessible from the dev console
  setInterval(() => {
    exposeToWindow({ levelConfig: getEditorInstance().getAllEntities() })
  }, 500)

  return editor
}

// const
