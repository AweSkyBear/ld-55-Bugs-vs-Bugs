import { Func, Point } from '~/common/types'
import {
  constructEvents,
  createThrottledDispatch,
  dispatchEvent,
  IEvent,
  obsDispCreator,
  obsDispEvents,
  ODAPI,
  TEventTarget,
} from '../OD'
import { TEventDispatchOptions } from 'obs-disp/dist/obs-disp'
import { exposeToWindow } from '~/common/debug'
import { IHTMLElWrapper, addHtmlEl } from '~/common/htmlEl/addHtmlEl'
import { events } from './events'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { renderGameTime } from './createTimer'
import { centerText } from '~/common/text'
import { ODHTMLEvents } from '~/core/createHTMLEvents'
import { defer } from '~/common/func'
import { createLD55Game } from './createLD55Game'
import { Global } from './global/global'

export const controlGameLostDialog = obsDispCreator(
  () => {
    const state = {
      text: null as Phaser.GameObjects.Text,
      gameLost: false,
      // ui: null as IHTMLElWrapper,
    }

    return {
      [obsDispEvents.OBS_CREATE]: () => {
        //
      },
      [events.LD_GAME_START]: () => {
        state.text?.destroy()
        state.gameLost = false
      },
      [events.LD_GAME_LOST]: () => {
        state.gameLost = true

        state.text =
          state.text ||
          centerText(
            ObservableScenes.foreground.add
              .text(
                0,
                0,
                `
You survived ${renderGameTime()} minutes!\n
Total killed bugs: ${Global.totalKills}\n
Total bugs summoned: ${Global.totalBugsSummoned}\n
\n
Press R to restart the game
              `,
                {
                  padding: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20,
                  },
                }
              )
              .setBackgroundColor('#000')
              .setFontSize('3em')
          )
      },
      [ODHTMLEvents.HTML_EV_ANY]: ({ payload }) => {
        const { type, wrappedEventArgs } = payload
        // PRESSING SPACE
        if (state.gameLost && type === 'keydown' && wrappedEventArgs[0].key === 'r') {
          console.log('restart!')

          window.location.reload() // hardcore workaround for now

          // RECREATE THE ENTIRE GAME
          // ODAPI.removeAllObservers('ld-55-game')
          // defer(() => createLD55Game())
        }
      },

      [obsDispEvents.OBS_REMOVE]: () => {
        //
      },
    }
  },
  { id: 'control-game-lost' }
)
