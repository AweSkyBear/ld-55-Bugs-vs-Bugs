import { dispatchEvent, obsDispCreator, obsDispEvents } from '../OD'
import { events } from './events'
import { createBug } from './createBug'
import { basedOn } from '~/common/func'
import Image from 'phaser3-rex-plugins/plugins/gameobjects/mesh/perspective/image/Image'
import ForegroundScene from '~/scenes/ForegroundScene'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { TEXTURES_MAP } from '~/textures/textures'
import { bottomizeText, centerXText } from '~/common/text'
import { Global, setTempIgnoreGlobalPointerDown } from './global/global'
import { PointLight } from '~/common/types'
import { sceneEvents } from '~/events/sceneEvents'
import { inputEvents } from '~/events/inputEvents'

export const controlBottomActions = obsDispCreator(() => {
  const state = {
    container: null as Phaser.GameObjects.Container,
    bonusUnsummonBtn: null as Phaser.GameObjects.Image,
    // Unsummon action:
    unsummonOverlay: null as PointLight,
    isUnsummoning: false,
  }

  const scene = ObservableScenes.game

  return {
    [obsDispEvents.OBS_CREATE]: () => {
      //
      state.container = ObservableScenes.foreground.add.container()

      state.container.add([
        ObservableScenes.foreground.add.image(0, 0, TEXTURES_MAP.BTN_BASE).setScale(0.5),

        (state.bonusUnsummonBtn = ObservableScenes.foreground.add.image(
          0,
          0,
          TEXTURES_MAP.BTN_UNSUMMON
        )).setScale(0.4),
      ])

      state.bonusUnsummonBtn.setInteractive().on('pointerdown', () => {
        setTempIgnoreGlobalPointerDown()

        // dispatchEvent(events.LD_IS_UNSUMMONING)
        Global.isUnsummoning = true

        state.isUnsummoning = true
        state.unsummonOverlay = state.unsummonOverlay || (switchUnsummonOn() as any)
        state.unsummonOverlay.alpha = 1
      })

      // position
      centerXText(state.container as any)
      bottomizeText(state.container as any)
    },
    [inputEvents.GLOBAL_POINTER_DOWN]: () => {
      if (state.isUnsummoning) {
        console.log('ALL TOUCHING ITEMS - SUMMON BACK ! ;     HP INCR / change')

        dispatchEvent(events.LD_DO_UNSUMMON, {
          payload: { x: scene.input.activePointer.worldX, y: scene.input.activePointer.worldY },
        })

        state.unsummonOverlay.alpha = 0
        state.isUnsummoning = false
        Global.isUnsummoning = false
      }
    },
    [sceneEvents.UPDATE]: () => {
      if (state.isUnsummoning && state.unsummonOverlay) {
        state.unsummonOverlay.x = scene.input.activePointer.worldX
        state.unsummonOverlay.y = scene.input.activePointer.worldY
      }
    },
    // [events.any]: (ev) => {
    //   // const { points, pointsDelta } = ev.payload
    //   // state.points += pointsDelta

    //   // TODO:CONTinue
    //   // - add the 3 buttons,
    //   // - make them show createBonusAction() if player has enough points!
    //   // -- show the bonus overlay! / -- when it's active ->
    //   // ---- CLICK to apply it! -- createUnsummon, createDecoy, createShockwave,
    //   // ---- ESCAPE
    // },
  }
})

const switchUnsummonOn = () => {
  const overlay = createUnsummonOverlay()
  return overlay
}
const createUnsummonOverlay = () =>
  ObservableScenes.game.add.circle(0, 0, 300, 0xffff00, 0.5).setInteractive()

// const getPointsForKill = (props: Parameters<typeof createBug>[0]) => {
//   return basedOn({
//     small: () => 1,
//     big: () => 5,
//     large: () => 10,
//   })(props.type) as any as number
// }
