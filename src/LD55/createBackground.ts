import { Easing, Image, Point } from '~/common/types'
import { IObserver, addObsDisp, obsDispEvents } from '~/OD'
import { sceneEvents } from '~/events/sceneEvents'
import { TEXTURES_MAP } from '~/textures/textures'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { gameEvents } from '~/events/gameEvents'
import { createImage } from '~/common/image'
import { exposeToWindow } from '~/common/debug'
import { MatterObjActions } from '~/common/matter'
import { events } from './events'

/** Sky gradient + clouds image */
export const createBackground = (config?: { pos: Point }) => {
  const observers: IObserver[] = []
  const scene = ObservableScenes.game

  const state = {
    cloudsBgImg: null as Image,
    skyBgGradientImg: null as Image,
  }

  return addObsDisp({
    [obsDispEvents.OBS_CREATE]: ({ payload: {} }) => {},
    [gameEvents.GAME_START]: () => {
      // state.skyBgGradientImg = createImage({ scene, texture: TEXTURES_MAP.SKY_BACKGROUND })
      // state.skyBgGradientImg.scaleX = 4000
      // state.skyBgGradientImg.scaleY = 4
      // state.cloudsBgImg = createImage({ scene, texture: TEXTURES_MAP.CLOUDS }).setPosition(
      //   Plane.initialPos.x,
      //   Plane.initialPos.y
      // )
      // state.cloudsBgImg.setScale(20)
      // exposeToWindow({ state })
    },
    [sceneEvents.UPDATE]: () => {
      // if (_state.keySpace && scene.input.keyboard.checkDown(_state.keySpace, 500)) {
      //   _state.isPaused = !_state.isPaused
      //   _state.isPaused ? GameFlow.pauseGame() : GameFlow.resumeGame()
      //   debugLog('PAUSED')
      // }
    },
    [events.LD_TIMER_MINUTE_PASS]: () => {
      // create effect on the background
      const circles = ObservableScenes.game.children.list.filter(
        (o) => o.name === 'creation-circle'
      ) as Image[]
      const currentAlpha = circles[0].alpha

      ObservableScenes.game.children.list
        .filter((o) => o.name === 'creation-circle')
        .forEach((circ: Image) => {
          scene.add.tween({
            targets: [circ],
            alpha: { from: circ.alpha, to: 0.5 },
            scale: { from: circ.scale, to: circ.scale / 3 },
            ease: Easing.Circular.InOut,
            yoyo: true,
          })
        })
    },
    GAME_RESTART: () => {
      MatterObjActions.destroyAll([state.cloudsBgImg, state.skyBgGradientImg])
      ;(state.cloudsBgImg = null as Image), (state.skyBgGradientImg = null as Image)
    },
    GAME_WON: () => {
      MatterObjActions.destroyAll([state.cloudsBgImg, state.skyBgGradientImg])
      ;(state.cloudsBgImg = null as Image), (state.skyBgGradientImg = null as Image)
    },
    [obsDispEvents.OBS_REMOVE]: () => {
      // GlobalObservers.removeMultipleObs(observers)
      // _state.keySpace?.destroy()
      // _state.keySpace = null
    },
  })
}
