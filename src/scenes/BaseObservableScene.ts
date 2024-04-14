import throttle from '~/common/throttle'
import { callAll, switchOn } from '~/common/func'
import { TSceneKey } from '~/common/scene'
import { Func, Scene } from '~/common/types'
import { sceneEvents } from '~/events/sceneEvents'
import { dispatchEvent, IObserver, removeObs } from '~/OD'
import { exposeToWindow } from '~/common/debug'

export const ObservableScenes = {
  game: null as IObservableScene,
  foreground: null as IObservableScene,
  background: null as IObservableScene,
  bootScene: null as IObservableScene,
}

exposeToWindow({ ObservableScenes })

export interface IObservableScene extends Scene {}

export interface IObservableSceneConfig {
  key: TSceneKey
  createObservers: (scene: Scene) => IObserver[]
  onCreate?: Func<Scene, void>
  onPreload?: Func<Scene, void>
}

/**
 * The fixed time-step
 * */
const TARGET_FPS = 60
const FPS_DELTA = 1000 / TARGET_FPS

/** Used to dispatch given events only from one scene */
let _FIRST_SCENE_KEY = null

/** Use to create all scenes - makes sure MatterJS physics are fixed (diff refresh rate) */
export const createObservableScene = (config: IObservableSceneConfig) => {
  const { createObservers, key, onCreate, onPreload } = config

  if (!_FIRST_SCENE_KEY) _FIRST_SCENE_KEY = key

  return class ObservableScene extends Phaser.Scene {
    constructor() {
      super({
        key,
      })
    }

    private observers: IObserver[] = []
    /**
     * Makes sure that events are dispatched to the globalObservable as well
     * (only from one scene)
     */
    // private _dispatchEvent: typeof dispatchEvent = (...args) => {
    //   // dispatchEvent(this.observable, args[1], args[2])
    //   // _FIRST_SCENE_KEY === key && dispatchEvent(globalObservable, args[1], args[2])
    //   dispatchEvent(this.observable, args[1])
    //   // _FIRST_SCENE_KEY === key && dispatchEvent(globalObservable, args[1])
    // }

    // public observable: IObservable = { observers: [] }
    // public mainSceneObservable: IObservable // TODO: to be able to retrieve

    async preload() {
      onPreload && onPreload(this)
    }
    create() {
      ///// update global scene accessor
      switchOn<TSceneKey>({
        GAME_SCENE: () => (ObservableScenes.game = this as any),
        BACKGROUND_SCENE: () => (ObservableScenes.background = this as any),
        FOREGROUND_SCENE: () => (ObservableScenes.foreground = this as any),
        BOOT_SCENE: () => (ObservableScenes.bootScene = this as any),
      })(key)

      // storeObservable(this.observable)
      this.observers = createObservers(this)

      dispatchEvent(sceneEvents.CREATE, { payload: { key } })

      this.scene.scene.events.on('destroy', () => {
        this.observers.forEach((o) => removeObs(o))
        this.observers = []

        dispatchEvent(sceneEvents.DESTROY, { payload: { key } })
      })

      this.scene.scene.events.addListener(
        Phaser.Scenes.Events.POST_UPDATE,
        callAll(this.postUpdate, this.postUpdateThrottled)
      )

      onCreate && onCreate(this)
    }

    //////// ->
    //  HIGHER-MONITOR-REFRESH-RATE-ISSUES:SOLVED: have autoUpdate: false, fps: 60 and .step:
    private _deltaAccum = 0
    private _isUpdatingThisStep = false

    update(time, delta) {
      const currentFPS = 1000 / delta
      const currentFPSFactor = TARGET_FPS / currentFPS
      //  HIGHER-MONITOR-REFRESH-RATE-ISSUES:SOLVED: simulation visual speed
      this.matter.world.engine.timing.timeScale = currentFPSFactor

      this._deltaAccum += delta

      this._isUpdatingThisStep = this._deltaAccum > FPS_DELTA

      if (this._deltaAccum > FPS_DELTA) {
        this._deltaAccum -= FPS_DELTA
        // if (this.matter.world.enabled) {
        //  HIGHER-MONITOR-REFRESH-RATE-ISSUES:SOLVED: UPDATE to always be dispatched 60 times per second
        key === _FIRST_SCENE_KEY &&
          dispatchEvent(sceneEvents.UPDATE, {
            payload: {
              time,
              delta,
              deltaAccum: this._deltaAccum,
              currentFPSFactor,
            },
          })
        // }
      }
    }

    private postUpdate = (...args: any[]) => {
      key === _FIRST_SCENE_KEY &&
        dispatchEvent(sceneEvents.POST_UPDATE, {
          payload: {
            isUpdatingThisStep: this._isUpdatingThisStep,
          },
        })
    }

    // TODO: dispatch to ALL !!!
    private postUpdateThrottled = throttle(50, () => {
      key === _FIRST_SCENE_KEY && dispatchEvent(sceneEvents.POST_UPDATE_THROTTLED)
    })
  }
}
