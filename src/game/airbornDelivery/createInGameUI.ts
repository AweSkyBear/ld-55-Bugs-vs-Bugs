import { addObsDisp, createThrottledDispatch, obsDispEvents } from '~/OD'
import { Point, Text } from '~/common/types'
import { sceneEvents } from '~/events/sceneEvents'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { gameEvents } from '~/events/gameEvents'
import { centerText, createLabelBtnText } from '~/common/text'
import { getTopRight } from '~/common/screen'
import { inputEvents } from '~/events/inputEvents'
import { payloadProp } from '~/OD'
import { isInGame } from './global/GameStateSingleton'

const HELP_TEXT = `- W/S - or arrows UP/DOWN to steer plane up/down\n
- SPACE - for plane high gear ;)\n
- E - to eject the crate (inside green areas) ;)\n
- P - to pause/unpause + WASD or arrows to investigate map
- R - to restart a level
- X - to exit from a level
Goal - land the crate near a \nflag for at least 3 seconds\n
Tip 0: pause a level\n with P to pan around and see the area
Tip 1: ejecting the crate\nat different speed causes a different\n direction and velocity
Tip 2: speeding the plane makes the ejection different\n
Tip 3: don't crash the plane! \n`

export const createInGameUI = (config?: { pos: Point }) => {
  const scene = ObservableScenes.foreground

  const state = {
    f1Btn: null as Text,
    keyF1: false,
    canKeyF1: true,
    howToPlayText: null as Text,
  }

  const toggleHowToPlayText = () => {
    state.howToPlayText =
      state.howToPlayText ||
      centerText(
        createLabelBtnText({
          scene,
          text: HELP_TEXT,
          config: { fontSize: '2rem' },
        })
      )

    state.howToPlayText.setText(HELP_TEXT).setVisible(!state.howToPlayText.visible)
  }

  return addObsDisp({
    [obsDispEvents.OBS_CREATE]: ({ payload: {} }) => {
      // todo? child observers?
    },
    [gameEvents.GAME_START]: () => {
      /////////// SELECTED LVL NAME DIsPLAYED
      if (!state.f1Btn) {
        state.f1Btn = createLabelBtnText({
          scene,
          coords: { x: 150, y: 400 },
          text: `F1`,
          config: { fontSize: '5rem' },
        })
          .setPosition(
            getTopRight(ObservableScenes.foreground, { x: -15, y: -15 }).x,
            getTopRight(ObservableScenes.foreground, { x: -15, y: -15 }).y
          )
          .on('pointerdown', () => {
            toggleHowToPlayText()
          })
      }

      state.howToPlayText?.setVisible(true)
    },
    [gameEvents.SCREEN_GO_TO_BEFORE_GAME]: () => {
      state.howToPlayText?.setVisible(false)
    },
    [inputEvents.INPUT_UPDATE_STATE]: (ev) => {
      const keys = payloadProp<Record<string, boolean>>('keys')(ev)
      state.keyF1 = keys.F1
    },
    [sceneEvents.UPDATE]: () => {
      if (state.keyF1 && state.canKeyF1 && isInGame()) {
        toggleHowToPlayText()

        state.canKeyF1 = false
        setTimeout(() => (state.canKeyF1 = true), 300)
      }
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      // GlobalObservers.removeMultipleObs(observers)
      // _state.keySpace?.destroy()
      // _state.keySpace = null
    },
  })
}
