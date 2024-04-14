import { defaultTo, isEmpty, path } from 'ramda'
import { setGlobalVar } from './debug'
import { merge, noop } from './func'
import {
  DPR,
  getGameCanvas,
  getRelativeScale,
  getScreenDprHeight,
  getScreenDprWidth,
} from './screen'
import { Func, Point, Scene, Text } from './types'

const DEFAULT_TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: '"VT323", Verdana, "Times New Roman", Tahoma, serif',
  fontSize: '1.5rem' as any,
  color: '#ffffff',
}

export const isTextSafe = (text: Text) => text && !isEmpty(path(['texture', 'frames'])(text))
export const setTextSafe = (text: Text, str: string) =>
  isTextSafe(text) ? text.setText(str) : text

export const getFontRem = (remVal: number) => {
  // DUE TO FONTS COMING BIGGER ON COMP
  const IS_CHROME_MOBILE_DEBUG = navigator.userAgent.match(/(IS_MOCKED_PHONE)/)

  const divideBy2 = IS_CHROME_MOBILE_DEBUG
  const newVal = divideBy2 ? remVal / 1.35 : remVal
  // debugLog("VALUE", newVal, `${newVal}rem`);
  return `${newVal}rem` as any
}

export type TCreateTextConfig = {
  scene: Scene
  text: string
  coords?: Point
  config?: Phaser.Types.GameObjects.Text.TextStyle
}

export const drawText = (
  { scene, coords: _coords, text, config }: TCreateTextConfig = {} as any
) => {
  const coords = defaultTo({ x: 0, y: 0 }, _coords)

  const txt = scene.add
    .text(
      coords.x,
      coords.y,
      text,
      // DEFAULT_TEXT_STYLE
      merge(DEFAULT_TEXT_STYLE, config || {})
    )
    .setInteractive()

  return txt
  // setImmediate(() => txt.destroy())
}
setGlobalVar(drawText)

export const centerXText = (text: Text, offsetFromCenter: number = 0) => {
  if (!isTextSafe(text)) return
  text.setX(getScreenDprWidth() / 2 - text.width / 2 + offsetFromCenter)
  return text
}
export const centerYText = (text: Text, offsetFromCenter: number = 0) => {
  if (!isTextSafe(text)) return
  text.setY(getScreenDprHeight() / 2 - text.height / 2 + offsetFromCenter)
  return text
}

export const centerText = (text: Text, offsetFromCenter: Point = { x: 0, y: 0 }) => {
  if (!isTextSafe(text)) return
  text.setX(getScreenDprWidth() / 2 - text.width / 2 + offsetFromCenter.x)
  text.setY(getScreenDprHeight() / 2 - text.height / 2 + offsetFromCenter.y)
  return text
}

export const bottomizeText = (text: Text, offsetFromBottom: number = 0) => {
  if (!isTextSafe(text)) return
  text.setY(getScreenDprHeight() - text.height + offsetFromBottom)
  return text
}
export const hideText = (text: Text, offsetFromBottom: number = 0) => {
  if (!isTextSafe(text)) return
  text.setVisible(false)
  return text
}
export const showText = (text: Text, offsetFromBottom: number = 0) => {
  if (!isTextSafe(text)) return
  text.setVisible(true)
  return text
}

export const createCommonText = (scene: Scene) => {
  return centerText(
    scene.add
      .text(0, 0, ``)
      // .setScale(getRelativeScale())
      .setAlign('center')
      .setFontFamily('"VT323", Verdana, Courier New')
      .setFontSize('3rem' as any) //getFontRem(2.5))
      .setColor('#030303')
      .setShadow(0, 2, '#f3f3f3')
  )
}

export const createInGameUITitleText = (scene: Scene) => {
  return createCommonText(scene)
    .setFontFamily('Courier New, Verdana')
    .setFontSize(getFontRem(2))
    .setFontStyle('bold')
    .setShadow(0)
}

export const createInGameUIText = (scene: Scene) => {
  return (
    createCommonText(scene)
      .setFontFamily('"VT323", Verdana, Courier New')
      .setFontSize(getFontRem(2))
      // .setFontStyle('bold')
      .setShadow(0)
      .setShadow(0, 2, '#a0a0a0')
  )
}

export const createCommonTextLight = (scene: Scene) => {
  return centerText(
    scene.add
      .text(0, 0, ``)
      // .setScale(getRelativeScale())
      .setAlign('center')
      .setFontFamily('"VT323", Verdana, Courier New')
      .setFontSize(getFontRem(2))
      .setColor('#030303')
      .setShadow(0, 2, '#a0a0a0')
  )
}

export const createText = drawText

export const createHeaderText = (config: TCreateTextConfig) =>
  createText(merge(config, { config: { fontSize: '3rem' } }) as any)

/////////////////////// UNUESED?
export const createLabelBtnText = (config: TCreateTextConfig) =>
  createText(merge(config, { config: { fontSize: '2rem' } }) as any).setFontFamily(
    '"VT323", Verdana, Courier New'
  )

export const createSliderLabelText = (config: TCreateTextConfig) =>
  createText(merge(config, { config: { fontSize: '1.3rem', align: 'left' } }) as any)

export const createDialogContentText = (config: TCreateTextConfig) =>
  createText(merge(config, { config: { align: 'left' } }) as any)

export const configureMainText = (text: Text) => {
  text.setAlign('center')
  text.setFontFamily('"VT323", Verdana, Arial')
  text.setStroke('#de77ae', 10).setShadow(2, 2, '#333333', 2, true, true)
  // text.setFontSize(5)
  return text
}
