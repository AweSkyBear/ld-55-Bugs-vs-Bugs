//

import { Func, Point } from '~/common/types'
import {
  constructEvents,
  createThrottledDispatch,
  dispatchEvent,
  IEvent,
  obsDispCreator,
  obsDispEvents,
  TEventTarget,
} from '../OD'
import { TEventDispatchOptions } from 'obs-disp/dist/obs-disp'
import { exposeToWindow } from '~/common/debug'
import { IHTMLElWrapper, addHtmlEl } from '~/common/htmlEl/addHtmlEl'
import { defer, waitMs } from '~/common/func'
import { getGameCanvas } from '~/common/screen'
import { inputEvents } from '~/events/inputEvents'
import { unfocusElHack } from '~/common/htmlEl/dom'
import { events } from './events'
import { Global } from './global/global'
import { sceneEvents } from '~/events/sceneEvents'
import { renderGameTime } from './createTimer'

export const createBottomLeftUI = obsDispCreator(
  () => {
    const state = {
      timerEl: null as IHTMLElWrapper,
      pointsEl: null as IHTMLElWrapper,
      label: null as IHTMLElWrapper,
      hpSummonSlider: null as IHTMLElWrapper,
      //
      points: 0,
      selectedHp: Global.summonCountDefault,
      leftHp: 100,
    }

    const refreshUiHTML = () => {
      getSliderEl()?.removeEventListener('input', handleSliderChange)
      getSliderEl()?.removeEventListener('change', handleSliderChangeEnd)
      getSliderEl()?.removeEventListener('keydown', handleSliderChangeEnd)

      // events
      state.pointsEl?.setHTML(getPointsHTML(state.points))
      state.hpSummonSlider?.setHTML(getSummonSlliderHTML(state.selectedHp, state.leftHp))
      state.label?.setHTML(getSummonLabelHTML(state.selectedHp, state.leftHp))

      getSliderEl().addEventListener('input', handleSliderChange)
      getSliderEl().addEventListener('change', handleSliderChangeEnd)
      getSliderEl().addEventListener('keydown', handleSliderChangeEnd)
    }

    const handleSliderChange = (ev: any) => {
      const val = Number((ev.target as any).value)
      state.selectedHp = val
      dispatchEvent(events.LD_SUMMON_SET_COUNT, { payload: { count: val } })
      state.label.el.querySelector('label').innerHTML = getLabelText(state.selectedHp, state.leftHp)
    }
    const handleSliderChangeEnd = (ev) => {
      // UNFOCUS
      unfocusElHack(getSliderEl())
    }

    const syncSliderMax = () => {
      getSliderEl().max = `${state.leftHp}`
    }

    const getUIEl = () => document.querySelector<HTMLElement>('#ui')
    const getSliderEl = () => document.querySelector<HTMLInputElement>('.hp-summon-slider')

    return {
      [obsDispEvents.OBS_CREATE]: async () => {
        //

        state.timerEl = addHtmlEl({
          attachTo: document.querySelector('#ui'),
        })
        state.pointsEl = addHtmlEl({
          attachTo: document.querySelector('#ui'),
        })
        state.label = addHtmlEl({
          attachTo: document.querySelector('#ui'),
        })
        state.hpSummonSlider = addHtmlEl({
          attachTo: document.querySelector('#ui'),
        })
        refreshUiHTML()

        // position fix:
        // note: recalc width based on canvas width!
        getUIEl().style.cssText = `
          position: fixed;
          bottom: 1em;
          width: ${getGameCanvas().offsetWidth}px;
          margin-left: 2em;
        `
      },
      [inputEvents.INPUT_SCREEN_RESIZE]: () => {
        // update position
        getUIEl().style.width = `${getGameCanvas().offsetWidth}px`
      },
      [events.LD_PLAYER_SUMMON_ENDED]: () => {
        // Take the HP in terms of the last summon count
        state.leftHp -= state.selectedHp
        state.selectedHp = Math.min(state.selectedHp, state.leftHp)

        dispatchEvent(events.LD_EARTH_DECREASE_HP, { payload: { hpDecrement: state.selectedHp } })

        // sync
        dispatchEvent(events.LD_SUMMON_SET_COUNT, { payload: { count: state.selectedHp } })

        refreshUiHTML()
      },
      [events.LD_EARTH_HIT]: (ev) => {
        const { hp: earthHp } = ev.payload
        state.leftHp = earthHp
        state.selectedHp = Math.min(state.selectedHp, state.leftHp)

        dispatchEvent(events.LD_SUMMON_SET_COUNT, { payload: { count: state.selectedHp } })

        refreshUiHTML()
      },
      [events.LD_EARTH_INCREASE_HP]: (ev) => {
        const { hpIncrement } = ev.payload
        state.leftHp += hpIncrement

        refreshUiHTML()
      },
      [events.LD_POINTS_CHANGED]: (ev) => {
        const { points } = ev.payload
        state.points = points

        refreshUiHTML()
      },
      [sceneEvents.UPDATE]: (ev) => {
        state.timerEl?.setHTML(getTimerHTML())
      },
      [obsDispEvents.OBS_REMOVE]: () => {
        //
      },
    }
  },
  { id: 'spawn-ui ' }
)

const getLabelText = (selectedHp: number, leftHp: number) =>
  `<b>Summon bugs:</b> ${selectedHp}, <b>Max / Earth HP</b>: ${leftHp}`
const getSummonLabelHTML = (selectedHp: number, leftHp: number) => {
  return `<label class="hp-summon-slider-label bg-1">
            ${getLabelText(selectedHp, leftHp)}
          </label>`
}

const getSummonSlliderHTML = (selectedHp: number = 2, leftHp: number) => {
  return `<input tabindex="-1" style="width: 300px;" class="hp-summon-slider" type="range" min="1"
     max="${leftHp}" value="${selectedHp}" step="1" />`
}

const getPointsInnerHTML = (points: number) => `<b>Kill Points:</b> ${points}`

const getPointsHTML = (points: number) => {
  return `<label class="points-label bg-1">
              ${getPointsInnerHTML(points)}
            </label>`
}

const getTimerInnerHTML = () => renderGameTime()

const getTimerHTML = () => {
  return `<label class="timer-label bg-1">
              ${getTimerInnerHTML()}
            </label>`
}
