import { exposeToWindow } from '~/common/debug'
import { plugEditor } from '../../plugEditor'

let _editorInstance: IUSEEditor = null

export interface IUSEEditor extends ReturnType<typeof plugEditor> {}

export const getEditorInstance = () => _editorInstance
export const setEditorInstance = (editor: IUSEEditor) => (_editorInstance = editor)

exposeToWindow({ getEditorInstance })
