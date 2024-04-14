import { addObsDisp, removeObs } from '~/OD'
import { exposeToWindow } from '~/common/debug'
import { createLevel } from '~/game/airbornDelivery/createLevel'
import { plugEditor } from './plugEditor'
// import { GlobalObservers, IObserver, addObsDisp } from '~/OD'
import { getGameScene } from '~/scenes/common'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { TCanvasEntity } from './_new/canvasEntity'
import { waitMs } from '~/common/func'
import { TEXTURES_MAP } from '~/textures/textures'
import { createGroundEl } from '~/game/airbornDelivery/editor/createGroundEl'
import { createEjectAreaEl } from '~/game/airbornDelivery/editor/createEjectAreaEl'
import { obsDispEvents } from 'obs-disp'

export const initializeEditor = (game: Phaser.Game) => {
  const aleGsfe = plugEditor({
    scene: game.scene.getScene('GAME_SCENE'),
    miscFunctions: {
      // dispatchEvent,
    },
    entityFunctions: {
      createSquare,
      createRect,
      createGroundEl,
      createEjectAreaEl,
    },
    propTypes: {
      x: 0,
      y: 0,
      w: { min: 0, value: 800 },
      h: { min: 0, value: 800 },
      texture: [TEXTURES_MAP.GROUND1, TEXTURES_MAP.GROUND2],
      angle: { min: -180, max: 180, step: 1, value: 0 },
      withFlag: false,
    },
    onEntityAdd: (addedEntity) => {
      // observers.push(addedEntity)
    },
    onEntityRemove: (removedEntity) => {
      removedEntity.destroy ? removedEntity.destroy() : removeObs(removedEntity)
    },
    // TODO:ALE:1 - DEFAULT THIS  --> if NOT provided will RUN the 'remove entity + re-add entity logic'
    onEntityUpdate: (removedEntity, _marker, rerunCreate) => {
      removeObs(removedEntity)
      rerunCreate()
    },
    onEditStop: () => {
      // clean all observers
    },
  })
  exposeToWindow({ aleGsfe })

  // AUTOSTART EDITING
  // aleGsfe.editStart()
}

// test Entity Function
const createSquare = (
  x,
  y // editorProps: TCanvasEntity['editorProps'], a, b) =>
) =>
  addObsDisp(() => {
    const scene = ObservableScenes.game

    const state = {
      rect: null as Phaser.GameObjects.Rectangle,
    }

    return {
      [obsDispEvents.OBS_CREATE]: () => {
        state.rect = scene.add.rectangle(x, y, 50, 50, 0x44ddaa)

        console.log('SQUARE CREATED')
      },
      [obsDispEvents.OBS_REMOVE]: () => {
        state.rect?.destroy()
        state.rect = null

        console.log('SQUARE REMOVED')
      },
    }
  })

// another test Entity Function
const createRect = (x, y) =>
  addObsDisp(() => {
    const scene = ObservableScenes.game

    const state = {
      rect: null as Phaser.GameObjects.Rectangle,
    }

    return {
      [obsDispEvents.OBS_CREATE]: () => {
        state.rect = scene.add.rectangle(x, y, 50, 100, 0x00bbff)

        console.log('RECT CREATED')
      },
      [obsDispEvents.OBS_REMOVE]: () => {
        state.rect?.destroy()
        state.rect = null

        console.log('RECT REMOVED')
      },
    }
  })
