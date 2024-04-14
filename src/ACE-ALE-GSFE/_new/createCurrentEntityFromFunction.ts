import { TCanvasEntity } from './canvasEntity'
import { parseFunction } from './parseFunction'

export const createCurrentEntityFromFunction = (
  data: TCanvasEntity,
  entityFunctions: Record<string, Function>
) => {
  const funcToRun = entityFunctions[data.functionName]
  const argNames: string[] = parseFunction(funcToRun).args

  const newEntity = funcToRun(...argNames.map((arg) => data.editorProps[arg]))

  return newEntity
}
