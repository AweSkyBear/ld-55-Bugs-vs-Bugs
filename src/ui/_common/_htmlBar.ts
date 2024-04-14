import uniqid from 'uniqid'
import { ObservableScenes } from '~/scenes/BaseObservableScene'
import { createStaticSprite } from '~/common/image'
import { IMatterSpriteFixed, MatterObjActions } from '~/common/matter'
import { ObjectFinder } from '~/common/objectFinder'
import { createHTMLTexture, toCSSPX, _HTML_OBJ_STYLE_TEXT } from '~/common/htmlObj'
import { getCanvasPXWidthFromPct } from '~/common/screen'
import { switchOn } from '~/common/func'
import { Func, Sprite } from '~/common/types'

interface ICreateHTMLBarProps {
  name?: string
  text: string
  style?: any
  pct?: number
  type?: 'front' | 'back'
  // onClick: Func<never, void>
}

const _HTML_BAR_WIDTH_PX = getCanvasPXWidthFromPct(80)

const _HTML_BAR_STYLE = {
  ..._HTML_OBJ_STYLE_TEXT,
  'font-size': '1.5rem',
  width: toCSSPX(_HTML_BAR_WIDTH_PX),
  height: '1.5rem',
  position: 'relative',
  // top: '-20px', // NOTE: pos does not matter here
  'text-align': 'center',
  margin: '0 auto',
  background: '#0400ff',
  border: '1px dashed #3000b3',
  padding: '2px',
}
const _HTML_BAR_STYLE_FRONT = {
  height: '1.5rem',
  background: '#0f15bb',
  // padding: '0.2rem',
  'box-shadow': 'none',
  border: '2px dashed #9abcff',
}

export const createHTMLBar = async (
  {
    name: _name,
    text,
    style,
    pct = 100,
    type,
  }: // onClick,
  ICreateHTMLBarProps,
  opts: { onCreate: (bar: Sprite, result: any) => void } = {} as any
) => {
  // const getDefaultResult = () => ({
  //   bar: null as Sprite,
  //   pct: 100,
  //   setPct: null as Func<number, ReturnType<typeof getDefaultResult>>
  // })

  // let result2 = getDefaultResult()
  const sc = ObservableScenes.foreground
  const name = _name || uniqid('htmlBar-')
  const existingBar = ObjectFinder.findFirstByName<IMatterSpriteFixed>(sc, name)

  // const el = document.createElementNS()
  // TODO: create from HTML
  //   <div class="xp-bar">
  //   <div class="xp-bar-filled"></div>
  // </div>
  let finalBarProps = { ..._HTML_BAR_STYLE, ...style }
  if (type === 'front') {
    finalBarProps = _HTML_BAR_STYLE_FRONT
  }

  // switchOn({
  //   front: () => {
  //     finalBarProps = {
  //       ...finalBarProps,
  //       ..._HTML_BAR_STYLE_FRONT,
  //     }
  //   },
  //   back: () => {},
  // })(type)
  const _createTexture = async (pct: number) => {
    if (pct && pct < 100) {
      finalBarProps.width = toCSSPX(getCanvasPXWidthFromPct(pct, _HTML_BAR_WIDTH_PX))
    }

    const texture = await createHTMLTexture({
      createDOMEl: () => sc.add.dom(0, 0, 'div', finalBarProps),
      // TODO: the nested EL ?
    })
    return texture
  }

  //// initial creation
  const texture = !existingBar && (await _createTexture(pct))

  const bar = existingBar || createStaticSprite({ scene: sc, texture: texture.key }).setName(name) // ?.setInteractive()

  ////
  /** If not first-time creation */
  if (type === 'back') {
    bar.setAlpha(0.7)
  }
  // switchOn({
  //   front: () => {
  //     bar.setAlpha(0.7)
  //   },
  //   back: () => {},
  // })(type)

  const _recreateTexture = async (result) => {
    const origTexture = bar.texture
    const newTxt = await _createTexture(result.pct)
    bar.setTexture(newTxt.key)

    // cleanup
    origTexture.destroy()
  }

  const result = {
    bar,
    pct,
    setPct: async (pct: number) => {
      pct = Phaser.Math.Clamp(pct, 0.000001, 99.99999)
      result.pct = pct
      await _recreateTexture(result)
      return result
    },
    setCSSStyle: async (CSSObj = {}) => {
      Object.assign(finalBarProps, CSSObj)
      await _recreateTexture(result)
      return result
    },
    destroy: () => {
      texture.destroy()
      MatterObjActions.destroy(bar)
    },
  }

  opts.onCreate && opts.onCreate(bar, result)

  return result
}
