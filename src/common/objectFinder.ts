import { pathOr, equals, compose, propEq } from './func'
import { GameObject, Scene } from './types'

const nameMatches = (name: string) => propEq('name', name)
const gameObjectNameFromBody = pathOr('', [ 'gameObject', 'name' ])
const gameObjectNameFromBodyEquals = (targetName: string) =>
  compose(equals(targetName), gameObjectNameFromBody)

export const ObjectFinder = {
  findFirstByName: <T extends GameObject>(scene: Scene, objName: string) => {
    return scene.children.getByName(objName) as T
  },
  findByName: <T extends GameObject>(scene: Scene, objName: string) => {
    return scene.children.list.filter(nameMatches(objName)) as T[]
  },
  findByObjectNameOnBody: (scene: Scene, objName: string) => {
    return scene.matter.getMatterBodies().filter(gameObjectNameFromBodyEquals(objName))
  },
}
