import { IEvent, addObsDisp, createThrottledDispatch, dispatchEvent } from '~/OD'
import { debugLog } from '~/common/debug'
import { always, basedOnPartial, clone, pick } from '~/common/func'
import { getCanvasCoordsInfo, getGameCanvas } from '~/common/screen'
import throttle from '~/common/throttle'
import { ISceneWithRexGestures, Point, Pointer, Scene, SceneWithRexUI, Size } from '~/common/types'
import { inputEvents } from '~/events/inputEvents'
import { sceneEvents } from '~/events/sceneEvents'
// import { createThrottledDispatch, dispatchEvent } from '~/OD'

export const initInputDispatcherObserver =
  (getIsOverObj: (scene: Scene, pointer: Pointer) => any = always(false)) =>
  (scene: ISceneWithRexGestures) => {
    return addObsDisp(() => {
      const _state: {
        keys: Record<string, boolean>
        down: boolean
        up: boolean
        space: boolean
        inEdgeSlide: boolean
        firstMouseDownPointer?: Phaser.Input.Pointer
        firstMouseDownInObj?: boolean
        // NOTE: for now these are unused
        lastPointerPos: Point
        // NOTE: for now these are unused
        lastPointerPosThrottled: Point

        preventDoubleBufferedSingleTap: boolean

        preventGlobalPanSingle: boolean
      } = {
        keys: {},
        down: false,
        up: false,
        space: false,
        inEdgeSlide: false,
        firstMouseDownInObj: null,
        firstMouseDownPointer: null,
        lastPointerPos: null,
        lastPointerPosThrottled: null,

        preventDoubleBufferedSingleTap: false,
        preventGlobalPanSingle: false,
      }

      // TODO: create the touch controls - and use them!
      // scene.input.keyboard.on('keydown-A', () => {
      //   dispatchEvent(inputEvents.DRAG_LEFT)
      // })

      // scene.input.keyboard.on('keydown-D', () => {
      //   dispatchEvent(inputEvents.DRAG_RIGHT)
      // })

      scene.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Pointer) => {
        _state.firstMouseDownPointer = scene.input.activePointer
        const objOver = getIsOverObj(scene, scene.input.activePointer)
        _state.firstMouseDownInObj = objOver

        if (!_state.firstMouseDownInObj) {
          dispatchEvent(inputEvents.GLOBAL_POINTER_DOWN, {
            payload: {
              pointer,
              localPos: pick(['x', 'y'], scene.input.activePointer.position),
              worldPos: {
                x: scene.input.activePointer.worldX,
                y: scene.input.activePointer.worldY,
              },
            },
          })
        }
      })
      scene.input.on(Phaser.Input.Events.POINTER_UP, (pointer: Pointer) => {
        // debugLog('args', pointer.position, pointer.prevPosition)
        // debugLog('_state.lastPointerPos', _state.lastPointerPos)
        _state.firstMouseDownPointer = null
        if (!_state.firstMouseDownInObj) {
          dispatchEvent(inputEvents.GLOBAL_POINTER_UP)
        }
      })

      const dispatchScreenResize = throttle(200, (...args) =>
        dispatchEvent(inputEvents.INPUT_SCREEN_RESIZE, ...args)
      )

      window.onresize = () => {
        dispatchScreenResize({
          payload: getCanvasCoordsInfo(),
        } as any)
      }
      // INITIAL
      dispatchScreenResize({
        payload: getCanvasCoordsInfo(),
      } as any)

      const createSwipeEvent = (ev: any, swipe: any) => {
        // debugLog('VELO', swipe.dragVelocity)
        return {
          ...ev,
          payload: {
            velocity: swipe.dragVelocity,
          },
        }
      }

      const createPanEvent = (ev: any, firstMouseDown: Pointer, isOverObj: any, args: any[]) => {
        return {
          ...ev,
          payload: {
            firstMouseDown,
            pan: args[0],
            gameObject: isOverObj || args[1],
            lastPointer: args[2],
          },
        }
      }

      const createGlobalTapEvent = (ev: any, firstMouseDown: Pointer, args: any[]) => {
        return {
          ...ev,
          payload: {
            firstMouseDown,
            evArgs: args,
          },
        }
      }

      const createGlobalPinchEvent = (ev: any, args: any[]) => {
        return {
          ...ev,
          payload: {
            evArgs: args,
          },
        }
      }

      return {
        HTML_EV_ANY: ({ payload }) => {
          // console.log(payload.type, payload)
          const key = payload.wrappedEventArgs[0].key
          const event = payload.wrappedEventArgs[0]

          basedOnPartial({
            keydown: () => {
              event.preventDefault()

              console.log('key', key)
              _state.keys[key] = true

              basedOnPartial({
                // ArrowLeft: () =>  (_state.left = true),
                ArrowDown: () => (_state.down = true),
                ArrowUp: () => (_state.up = true),
                ' ': () => (_state.space = true),
              })(key)
            },
            keyup: () => {
              event.preventDefault()

              _state.keys[key] = false

              basedOnPartial({
                // ArrowLeft: () => (_state.left = false),
                ArrowDown: () => (_state.down = false),
                ArrowUp: () => (_state.up = false),
                ' ': () => (_state.space = false),
                // ArrowRight: () => (_state.right = false),
              })(key)
            },
          })(payload.type)
        },
        [sceneEvents.POST_UPDATE]: (ev: IEvent) => {
          dispatchEvent(inputEvents.INPUT_UPDATE_STATE, { payload: _state })
          // _state.down && dispatchEvent(inputEvents.KEY_DOWN)
          // _state.up && dispatchEvent(inputEvents.KEY_UP)
          //

          _state.preventGlobalPanSingle &&
            setTimeout(() => {
              _state.preventGlobalPanSingle = false
            })
          _state.lastPointerPos = clone(scene.input.activePointer.position)
          if (_state.preventDoubleBufferedSingleTap) {
            setTimeout(() => {
              // _state.preventDoubleBufferedSingleTap = false
            })
          }
        },
        [sceneEvents.POST_UPDATE_THROTTLED]: (ev: IEvent) => {
          _state.lastPointerPosThrottled = clone(scene.input.activePointer.position)
        },
        [inputEvents.EDGE_SLIDE]: (ev: IEvent) => {
          _state.inEdgeSlide = true
        },
        [inputEvents.EDGE_SLIDE_END]: (ev: IEvent) => {
          _state.inEdgeSlide = false
        },
        [inputEvents.INPUT_PREVENT_GLOBAL_PAN_SINGLE]: (ev: IEvent) => {
          _state.preventGlobalPanSingle = true
        },
      }
    })
  }
