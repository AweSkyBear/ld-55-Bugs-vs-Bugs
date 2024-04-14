import { exposeToWindow } from '~/common/debug'

let _exposedFnNames: Record<string, Function> = {}

export const setEntityFunctions = (fnNames: Record<string, Function>) => (_exposedFnNames = fnNames)
export const getEntityFunctions = () => _exposedFnNames

export const getEntityFunctionNames = () => Object.keys(getEntityFunctions())

exposeToWindow({ getEntityFunctionNames, getEntityFunctions })
