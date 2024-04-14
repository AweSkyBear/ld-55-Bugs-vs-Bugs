import { Point, Text, Tween } from '~/common/types'
import { addObsDisp, obsDispEvents, payloadProp } from '~/OD'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { centerText, createLabelBtnText } from '~/common/text'

export const createToasts = (config?: { pos: Point }) => {
  const state = {
    text: null as Text,
    currentTween: null as Tween,
  }

  return addObsDisp({
    [obsDispEvents.OBS_CREATE]: ({ payload: {} }) => {},
    ['TOAST_CREATE']: (ev) => {
      state.text =
        state.text ||
        centerText(
          createLabelBtnText({
            scene: ObservableScenes.foreground,
            coords: { x: -1, y: -1 },
            text: '',
          })
        )

      const text = payloadProp<string>('text')(ev)
      centerText(state.text.setText(text))

      // console.log('CREATE TOAST: ', text)

      state.currentTween?.remove()
      state.currentTween = ObservableScenes.foreground.add.tween({
        targets: [state.text],
        scale: { from: 1, to: 1.3 },
        duration: 2000,
        yoyo: true,
        repeat: 0,
        onComplete: () => {
          state.text?.destroy()
          state.text = null
        },
      })
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      // GlobalObservers.removeMultipleObs(observers)
      // _state.keySpace?.destroy()
      // _state.keySpace = null
    },
  })
}
