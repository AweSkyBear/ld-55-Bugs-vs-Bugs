import { defaultTo } from 'ramda'
import { exposeToWindow } from '~/common/debug'
import { merge } from '~/common/func'
import { getMidPoint } from '~/common/screen'
import { Func, GameObject, Graphics, Point, Scene, Size } from '~/common/types'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { TweenBuilderConfig } from '../../common/types'

export const barComponent = (config: {
  scene: Scene
  pos?: Point
  width?: number
  height?: number
  progressPct?: number
  bgColor?: number
  foreColor?: number
  gfxFrontConfig?: Partial<Phaser.Types.GameObjects.Graphics.Options>
  gfxBackConfig?: Partial<Phaser.Types.GameObjects.Graphics.Options>
}) => {
  const initial = merge({ pos: { x: 0, y: 0 }, width: 70 }, config)
  const BAR_HEIGHT = defaultTo(30, initial.height)

  const defaultFrontConfig: Phaser.Types.GameObjects.Graphics.Options = {
    fillStyle: {
      color: config.foreColor || 0x0000ff,
      alpha: 0.8,
    },
    lineStyle: { width: BAR_HEIGHT, color: config.foreColor || 0x0000ff },
    ...initial.gfxFrontConfig,
  }

  const defaultBackConfig: Phaser.Types.GameObjects.Graphics.Options = {
    fillStyle: {
      color: config.bgColor || 0x000000,
      alpha: 1,
    },
    lineStyle: { width: BAR_HEIGHT, color: config.bgColor || 0x000000 },
    ...initial.gfxBackConfig,
  }

  const result = {
    defaultFrontConfig,
    defaultBackConfig,
    width: initial.width,
    height: initial.height,
    progressPct: defaultTo(0, initial.progressPct),
    pos: defaultTo({ x: 0, y: 0 }, initial.pos),
    // order MATTERS!
    gfxBack: initial.scene.add.graphics(defaultBackConfig),
    gfxFront: initial.scene.add.graphics(defaultFrontConfig),
    // initial
    lineBack: new Phaser.Geom.Line(
      initial.pos.x,
      initial.pos.y,
      initial.pos.x + initial.width,
      initial.pos.y
    ),
    lineFilled: new Phaser.Geom.Line(
      initial.pos.x,
      initial.pos.y,
      initial.pos.x + initial.width * (initial.progressPct / 100),
      initial.pos.y
    ),

    setPosition: (p: Point) => {
      result.pos = p
      result.onLineTargets((t) => t.setTo(p.x, p.y, p.x + result.width, p.y))

      // should re-set
      result.setProgressPct(result.progressPct)

      result.redraw()

      return result
    },
    updateLines: () => {
      result.lineBack.setTo(result.pos.x, result.pos.y, result.pos.x + result.width, result.pos.y)
      result.lineFilled.setTo(
        result.pos.x,
        result.pos.y,
        result.pos.x + result.width * (result.progressPct / 100),
        result.pos.y
      )
    },
    setWidth: (w: number) => {
      result.width = w

      result.updateLines()
      result.redraw()
      // result.gfxFront.s(p.x, p.y)
      // result.gfxBack.setPosition(p.x, p.y)
      return result
    },
    positionIn: {
      horMiddle: () => {
        // to foreground scene for now...
        result.setPosition({
          x: getMidPoint(ObservableScenes.foreground).x - result.width / 2,
          y: result.pos.y,
        })
        return result
      },
    },
    getSize: (): Size => {
      return { w: result.width, h: result.height }
    },
    destroy: () => {
      result.onGfxTargets((t) => {
        t.destroy()
      })
      return result
    },
    redraw: () => {
      result.onGfxTargets((t) => {
        t.clear()
      })

      result.gfxBack.setDefaultStyles(result.defaultBackConfig)
      result.gfxFront.setDefaultStyles(result.defaultFrontConfig)
      // order MATTERS!
      result.gfxBack.strokeLineShape(result.lineBack)
      result.gfxFront.strokeLineShape(result.lineFilled)
    },
    setProgressPct: (pct: number) => {
      result.progressPct = Phaser.Math.Clamp(pct, 0, 100)

      result.updateLines()

      result.redraw()

      return result
    },
    setAlpha: (alpha: number) => {
      // result._onTarget()
      result.onGfxTargets((t) => t.setAlpha(alpha))
      return result
    },
    tween: (config: TweenBuilderConfig) => {
      // TODO:
      return result
    },
    getTargets: () => {
      return [result.gfxBack, result.gfxFront]
    },
    //// TODO: TRY FIX TYPING
    onLineTargets: null as any, // as ReturnType<typeof createOnTarget<Phaser.Geom.Line>>,
    onGfxTargets: null as any, //as ReturnType<typeof createOnTarget<Graphics>>
    // onLineTargets:  null as ReturnType<typeof createOnTarget<Phaser.Geom.Line>> as any,
    // onGfxTargets:  null as ReturnType<typeof createOnTarget<Graphics>> as any
  }

  result.onLineTargets = createOnTarget<Phaser.Geom.Line>(result, [
    result.lineBack,
    result.lineFilled,
  ])
  result.onGfxTargets = createOnTarget<Graphics>(result, [result.gfxBack, result.gfxFront])

  // initial draw
  result.redraw()

  return result
}

const createOnTarget = <T extends any>(result: any, targets?: T[]) => {
  const _onTarget = (/* result: { getTargets: () => T[] },  */ cb: Func<T, void>) => {
    // result.getTargets().forEach(cb)
    targets.forEach(cb)
    return result
  }
  return _onTarget
}

export interface UIBarComponent extends ReturnType<typeof barComponent> {}

// TODO: create an abstraction that applies ALL Image/Sprite functions via a "targets" property -> e.g.
// to make use of setAlpha, setPosition, tween, etc.
// Targets. ... ALL functions that are commonly used
//////

exposeToWindow({ barComponent })
