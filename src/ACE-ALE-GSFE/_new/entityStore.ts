import { TCanvasMarker } from '../common/types'
import { exposeToWindow } from '~/common/debug'
import { getEditorInstance } from './global/editorInstance'

type TEntityId = string

const _entitiesByMarkerMap: Record<TEntityId, any> = {}
const _entitiesDataByMarkerMap: Record<TEntityId, any> = {}

export const addEntity = (entity: any, marker: TCanvasMarker) => {
  entity.__entityId = marker.getData('entityId')

  _entitiesByMarkerMap[entity.__entityId] = entity
}

export const removeEntity = (entity: any) => {
  delete _entitiesByMarkerMap[entity.__entityId]
}

export const getEntityByMarker = (marker: TCanvasMarker) => {
  return (
    // TODO:ALE:00 - FIX _entitiesByMarkerMap[marker.getData('entityId')] not working
    _entitiesByMarkerMap[marker.getData('entityId')] ||
    getEditorInstance()
      .getAllEntities()
      .find((e) => e.__entityId === marker.getData('entityId'))
  )
}

export const getEntityById = (entityId: TEntityId) => _entitiesByMarkerMap[entityId]

export const getAllEntities = (scene: Phaser.Scene) =>
  scene.children.list.filter((item) => item.name === 'marker').map((item) => item.data.getAll())

export const getAllMarkers = (scene: Phaser.Scene) =>
  scene.children.list.filter((item) => item.name === 'marker')

// TODO:ALE:00- we are not removing entities properly
exposeToWindow({ _entitiesByMarkerMap, getAllMarkers, getAllEntities })
