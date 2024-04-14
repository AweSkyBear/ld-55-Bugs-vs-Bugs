import { TUniforms } from './fxPipeline'
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'
import Factories from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'
import GesturesPlugin from 'phaser3-rex-plugins/plugins/gestures-plugin.js'
import { IShaderManager } from '~/fx/pipelines/shaders/ShaderManager'
export type LineStyle = Phaser.Types.GameObjects.Graphics.LineStyle
export type Graphics = Phaser.GameObjects.Graphics

export interface ICustomPipeline {
  uniforms: TUniforms
  active: boolean
}

export type WebGLRenderer = Phaser.Renderer.WebGL.WebGLRenderer
export class PostFXPipeline
  extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
  implements ICustomPipeline
{
  uniforms: TUniforms
  active: boolean
}

export class WebGLPipeline
  extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline
  implements ICustomPipeline
{
  uniforms: TUniforms
  active: boolean
}

export const Easing = Phaser.Math.Easing

export type GameObject = Phaser.GameObjects.GameObject
export type Text = Phaser.GameObjects.Text
/**
 * This is the Phaser.Scene with some fixes to typedefs
 */
export type Scene = Phaser.Scene
export interface SceneWithRexUI extends Phaser.Scene {
  rexUI: RexUIPluginFixed
  rexGestures: typeof GesturesPlugin & {
    add: any
  }
  rexModal: {
    modal: (gameObj: GameObject, config: Record<any, any>) => Promise<any>
  }
}
export interface ISceneWithRexGestures extends Scene {
  rexGestures: any
}

export type SceneWithShaderManager = Phaser.Scene & {
  shaderManager: IShaderManager
}
export type Image = Phaser.GameObjects.Image
export type Sprite = Phaser.GameObjects.Sprite
export type DOMElement = Phaser.GameObjects.DOMElement
export type MatterImage = Phaser.Physics.Matter.Image
export type MatterSprite = Phaser.Physics.Matter.Sprite
export type MatterBody = MatterJS.BodyType
export type MatterWorldConfig = Phaser.Types.Physics.Matter.MatterWorldConfig
export const getMatterBody = (obj: GameObject) => obj.body as MatterBody
export type ICollisionPair = MatterJS.ICollisionPair
export type ICollisionData = Phaser.Types.Physics.Matter.MatterCollisionData
export type PointLight = Phaser.GameObjects.PointLight
export type ForceVector = Point
export type Vector2 = Phaser.Math.Vector2
export type Zone = Phaser.GameObjects.Zone
export type TextStyle = Phaser.Types.GameObjects.Text.TextStyle
export type EasingFunc = (v: number) => number

export type Point = {
  x: number
  y: number
}
export type Size = {
  w: number
  h: number
}
export type Offset = {
  offX: number
  offY: number
}

export type PointSize = Point & Size & Partial<Offset>
export type PointSizeOffset = Partial<{
  x: number
  y: number
  w: number
  h: number
  offX: number
  offY: number
}>

export type Camera = Phaser.Cameras.Scene2D.Camera
export type CameraPanCallback = Phaser.Types.Cameras.Scene2D.CameraPanCallback

export type CamScrollPoint = {
  scrollX: number
  scrollY: number
}
export type Vector = Point

export type Pointer = Phaser.Input.Pointer

/////

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type Lit = string | number | boolean | undefined | null | void | {}
export type Filter<T, U> = T extends U ? T : never

export type Func<T, U> = (x?: T) => U
export type TransformNumFunc = Func<number, number>

export type Action<T> = (x?: T) => void
export type Predicate<T> = Func<T, boolean>

export type PipelineManager = Phaser.Renderer.WebGL.PipelineManager

// export type ClickFactory = RexUIPlugin.Factories ["clickFactory"];
type RexUIPluginFactories = Factories

// @ts-ignore
export interface RexUIPluginFixed extends RexUIPlugin {
  // add: Factories
  //  & {
  //   click: typeof ClickFactory;
  // }// & any // add.click NOT valid anymore :: NOTE: MAY NEED TO FIX THIS FURTHER AT SOME POINT (when using buttons) since 'add' will be used another way?
}

export type Tween = Phaser.Tweens.Tween
export type TweenBuilderConfig = Phaser.Types.Tweens.TweenBuilderConfig
export type TweenOnCompleteCallback = Phaser.Types.Tweens.TweenOnCompleteCallback
export type NumberTweenBuilderConfig = Phaser.Types.Tweens.NumberTweenBuilderConfig

export interface IGOWithAlpha extends Phaser.GameObjects.Components.Alpha {}

export type BaseShader = Phaser.Display.BaseShader
export type Shader = Phaser.GameObjects.Shader
export type TShaderUniforms = Record<
  string,
  {
    type: string
    value: any
  }
>
export type TShaderDefines = Record<string, any>

export namespace Geom {
  Phaser.Geom
}

export const Star = Phaser.GameObjects.Star

// import RBush from 'rbush'
// export type RTreeBBox = {}
// export interface IPhaserRTree<T> extends Omit<RBush<T>, 'search'> {
//   search: (bbox: RTreeBBox) => {}
// }

export const KeyCodes = Phaser.Input.Keyboard.KeyCodes
export const KeyboardEvents = Phaser.Input.Keyboard.Events
export const Keyboard = Phaser.Input.Keyboard
export type KeyboardKey = Phaser.Input.Keyboard.Key

export interface IDirty {
  isDirty?: boolean
}

export interface ISceneWithBackground extends Scene {
  background?: TileSprite
  backgrounds?: any[]
}

export type TileSprite = Phaser.GameObjects.TileSprite

export interface IDestroyable {
  destroy: Func<any, void>
}
