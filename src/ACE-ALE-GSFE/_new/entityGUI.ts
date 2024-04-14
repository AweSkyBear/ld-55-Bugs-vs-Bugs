import GUI, { Controller } from 'lil-gui'
import { TCanvasEntity, TCanvasEntityGUIActions } from './canvasEntity'
import { getODAPI } from './createEditor'
import { events } from './events'

import { TEntityFunctions } from './types'
import { basedOnPartial, defaultTo, defer, identityIfNotNil, isNil, isNotNil } from '../common/func'

import objectPath from 'object-path'
import { TEditorConfig } from '../plugEditor'
import throttle from '../common/throttle'
import { parseFunction } from './parseFunction'
import { updateEntityGUIField } from './updateEntityGUIField'
import { setGuiDataRef } from './global/guiDataRef'

export const entityGUI = (
  dataObjRef: TCanvasEntity & TCanvasEntityGUIActions,
  entityFunctions: TEntityFunctions,
  marker,
  propTypes: TEditorConfig['propTypes']
) => {
  const startTime = performance.now()
  /////// BASE GUI SETUP
  const g = new GUI()

  g.title('- ENTITY EDIT -')
  g.domElement.classList.add('gui-editing-entity')
  g.hide()

  const _onFieldChange = (propOrPath: string) =>
    throttle(100, (value: any) => {
      objectPath.set(dataObjRef, propOrPath, value)

      setGuiDataRef(dataObjRef) // keep the ref fresh

      updateEntityGUIField(propOrPath, value, dataObjRef, marker)
    })

  const guiTree = g.addFolder('Function Entity')
  guiTree.open()

  const entityFunctionNames = Object.keys(entityFunctions)

  const entityFunctionCtrl = guiTree
    .add(dataObjRef, 'functionName', entityFunctionNames)
    .name('Entity function')
    .onChange(_onFieldChange('functionName'))

  const editorPropsGui = guiTree.addFolder('Editor Props')
  editorPropsGui.open()

  /////// <- BASE GUI SETUP

  let controllers: Controller[] = []
  if (dataObjRef.functionName) {
    ////// AUTO PROPS from the function entity

    const argNames = parseFunction(entityFunctions[dataObjRef.functionName]).args

    controllers = argNames.map((arg) => {
      if (isNil(propTypes[arg]))
        throw new Error(
          `propTypes: prop type/config for "${arg}" not provided (for ${dataObjRef.functionName} entity)`
        )

      const argConfig = propTypes[arg]

      const isArray = argConfig instanceof Array
      const isObj = !isArray && argConfig instanceof Object
      console.log(`arg ${arg}, is Obj`, isObj)

      const argDefVal = isObj
        ? identityIfNotNil(argConfig.min)
        : !isArray
        ? argConfig
        : argConfig[0]

      // take from the marker, if exists
      const existingValue = objectPath.get(dataObjRef, ['editorProps', arg])
      // create the object path, so that arg controller is possible
      isNil(existingValue) && objectPath.set(dataObjRef, ['editorProps', arg], argDefVal)

      const argController = editorPropsGui.add(
        dataObjRef.editorProps,
        arg,
        // if obj -> use the .min value; if array -> pass it as is (populates select options)
        isObj && isNotNil(argConfig.min)
          ? argConfig.min
          : isArray && argConfig
          ? argConfig
          : undefined
      )

      argController.onChange(_onFieldChange(`editorProps.${arg}`))

      isObj &&
        isNotNil(argConfig.value) &&
        argController?.setValue(Number(existingValue || argConfig.value))
      isObj && isNotNil(argConfig.min) && argController?.min(argConfig.min)
      isObj && isNotNil(argConfig.max) && argController?.max(argConfig.max)
      isObj && isNotNil(argConfig.step) && argController?.step(argConfig.step)

      return argController
    })

    // workaround - trigger initial update (deferred - after all is initialized for this entity function),
    defer(() => {
      const controllerX = controllers.find((c) => c.property === 'x')
      controllerX.setValue(controllerX.getValue())
    })
  }

  //// buttons
  dataObjRef.onCopy = () =>
    getODAPI().dispatchEvent(events.USE_ENTITY_GUI_BTN_CLICK, { payload: { name: 'copy' } })
  guiTree.add(dataObjRef, 'onCopy').name('C: Copy')

  dataObjRef.onPaste = () =>
    getODAPI().dispatchEvent(events.USE_ENTITY_GUI_BTN_CLICK, { payload: { name: 'paste' } })
  guiTree.add(dataObjRef, 'onPaste').name('P: Paste')

  dataObjRef.onRemove = () =>
    getODAPI().dispatchEvent(events.USE_ENTITY_GUI_BTN_CLICK, { payload: { name: 'remove' } })
  guiTree.add(dataObjRef, 'onRemove').name('!!: Remove')
  //// <-buttons

  console.log('>>> entityGUI creation data', dataObjRef)
  g.show()

  console.log('entityGui: it took >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', performance.now() - startTime)
  return g
}
