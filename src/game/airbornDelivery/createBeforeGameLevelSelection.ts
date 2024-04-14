import { addObsDisp, dispatchDeferredEvent, dispatchEvent, obsDispEvents } from '~/OD'
import { gameEvents } from '~/events/gameEvents'
import { Text } from '~/common/types'
import { sceneEvents } from '~/events/sceneEvents'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { LEVEL_EDITOR_INDEX, Levels } from './levels/levels'
import { isEmpty } from 'ramda'
import { centerXText, createLabelBtnText } from '~/common/text'
import { exposeToWindow } from '~/common/debug'
import { defer, waitMs } from '~/common/func'

export const createBeforeGameLevelSelection = () => {
  const scene = ObservableScenes.foreground

  const state = {
    allElems: [] as Text[],
    gameTitleText: null as Text,
    levelButtons: [] as Text[],
    btnStart: null as Text,
    selectedLvlName: null as Text,
    selectedLvlInd: 0,
  }

  const getSelectedLvlInd = () => state.selectedLvlInd

  return addObsDisp({
    [obsDispEvents.OBS_CREATE]: ({ payload: {} }) => {
      // todo? child observers?
    },
    [gameEvents.GAME_START]: () => {
      state.allElems.forEach((b) => b.setVisible(false))
    },
    [gameEvents.SCREEN_GO_TO_BEFORE_GAME]: () => {
      if (isEmpty(state.levelButtons)) {
        const startLevelEditor = () => {
          dispatchEvent('LEVEL_SET_LEVEL', {
            payload: { index: LEVEL_EDITOR_INDEX },
          })

          defer(() => {
            dispatchEvent(gameEvents.GAME_START)

            defer(() => dispatchEvent(gameEvents.GAME_EDIT))
          })
        }

        const editorLvlBtn = createLabelBtnText({
          text: `Editor`,
          scene,
          config: {},
          coords: { x: 150, y: 150 },
        })
          .setInteractive()
          .setFontSize('3.5rem' as any)
          .on('pointerdown', () => {
            console.log('CLICK EditOR')
            startLevelEditor()
          })

        state.allElems.push(editorLvlBtn)

        state.levelButtons = Levels.map(
          (lvlConf, ind) =>
            createLabelBtnText({ text: `${ind + 1}`, scene, config: {} })
              .setInteractive()
              .setFontSize('3.5rem' as any)
          // .setData('isSelected', false)
        )

        // initial selected state
        const _updateBtnSelectedState = (b, ind) => {
          ind === getSelectedLvlInd()
            ? b.setFontSize('3.5rem' as any).setShadow(0, 2, '#000', 5, true)
            : b.setFontSize('3.5rem' as any).setShadow(0)
        }

        state.levelButtons.forEach((b, _ind) => {
          // initial
          _updateBtnSelectedState(b, _ind)

          b.on('pointerdown', (__b) => {
            //   __b.setData('isSelected', true)
            // SELECT THIS LEVEL
            state.selectedLvlInd = parseInt(b.text) - 1
            dispatchDeferredEvent('LEVEL_SET_LEVEL', {
              payload: { index: state.selectedLvlInd },
            })
            state.selectedLvlName?.setText(`Level: ${Levels[state.selectedLvlInd].name}`)

            // select/unselect the other buttons
            state.levelButtons.forEach((_b, _ind) => _updateBtnSelectedState(_b, _ind))
          })
        })

        Phaser.Actions.GridAlign(state.levelButtons, {
          width: 500,
          height: 300,
          cellWidth: 100,
          cellHeight: 100,
          x: 200,
          y: 300,
        })

        state.allElems.push(...state.levelButtons)

        // AUTOSTART THE EDITOR / hardcoded for now:
        waitMs().then(startLevelEditor)
      }

      exposeToWindow({ ...state })

      ////////// BTN START
      if (!state.btnStart) {
        state.btnStart = createLabelBtnText({
          scene,
          coords: { x: 150, y: 500 },
          text: 'GO >>>',
          config: { fontSize: '5rem' },
        })
        state.btnStart.on('pointerdown', () => {
          dispatchEvent(gameEvents.GAME_START)
        })
        state.allElems.push(state.btnStart)
      }
      /////////// SELECTED LVL NAME DIsPLAYED
      if (!state.selectedLvlName) {
        state.selectedLvlName = createLabelBtnText({
          scene,
          coords: { x: 150, y: 400 },
          text: `Level: ${Levels[0].name}`,
          config: { fontSize: '5rem' },
        })
        state.allElems.push(state.selectedLvlName)
      }

      /////////// GAME TITLE TEXT
      if (!state.gameTitleText) {
        state.gameTitleText = centerXText(
          createLabelBtnText({
            scene,
            coords: { x: 150, y: 50 },
            text: `Airborn Island Delivery!`,
            config: { fontSize: '4rem' },
          })
        )
        state.allElems.push(state.gameTitleText)
      }

      state.allElems.forEach((b) => b.setVisible(true))

      setTimeout(() => {
        // FONT SIZE BUG
        state.allElems.forEach((el) => el.setFontFamily('"VT323", Verdana, Arial'))
        state.selectedLvlName.setFontSize('3.5rem' as any)
        state.btnStart.setFontSize('4rem' as any)
        state.gameTitleText.setFontSize('4rem' as any)
        setTimeout(() => centerXText(state.gameTitleText))
      }, 50)
    },
    [sceneEvents.UPDATE]: () => {
      // if (_state.keySpace && scene.input.keyboard.checkDown(_state.keySpace, 500)) {
      //   _state.isPaused = !_state.isPaused
      //   _state.isPaused ? GameFlow.pauseGame() : GameFlow.resumeGame()
      //   debugLog('PAUSED')
      // }
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      // GlobalObservers.removeMultipleObs(observers)
      // _state.keySpace?.destroy()
      // _state.keySpace = null
    },
  })
}
