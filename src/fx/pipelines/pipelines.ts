import { Game } from 'phaser'
import {
  createCustomPipeline,
  createCustomPostFxPipeline,
  CustomWebGlPipeline,
  TUniforms,
} from '~/common/fxPipeline'
import * as frags from '~/fx/pipelines/frag'
import { Scene, PostFXPipeline, WebGLRenderer, WebGLPipeline } from '~/common/types'
import { merge, reduce } from '~/common/func'
import { debugWarn } from '~/common/debug'

export type PipelineName =
  | 'grayPost'
  | 'distortionPost'
  | 'cosmicGlow'
  | 'distortion2Post'
  | 'galaxyPost'
  | 'galaxy'
  | 'smokeGreenishPost'
  | 'textRecolor'
  | 'basePost'
  | 'textRecolorPost'
  | 'bend'
  | 'bendPost'
  | 'hueRotate'
  | 'hueRotatePost'
  | 'simpleBlur'
  | 'gaussianBlur'
  | 'gaussianBlurPost'

export const Pipelines: Record<PipelineName, PipelineName> = {
  grayPost: 'grayPost',
  distortionPost: 'distortionPost',
  distortion2Post: 'distortion2Post',
  cosmicGlow: 'cosmicGlow',
  galaxy: 'galaxy',
  galaxyPost: 'galaxyPost',
  smokeGreenishPost: 'smokeGreenishPost',
  textRecolor: 'textRecolor',
  textRecolorPost: 'textRecolorPost',
  bend: 'bend',
  basePost: 'basePost',
  bendPost: 'bendPost',
  hueRotate: 'hueRotate',
  hueRotatePost: 'hueRotatePost',
  simpleBlur: 'simpleBlur',
  gaussianBlur: 'gaussianBlur',
  gaussianBlurPost: 'gaussianBlurPost'
}

export const DEFAULT_PIPELINE_UNIFORMS = {
  [Pipelines.cosmicGlow]: {},
  [Pipelines.grayPost]: {
    gray: 1,
  },
  [Pipelines.distortionPost]: {
    timeFactor: 1,
  },
  [Pipelines.distortion2Post]: {
    timeFactor: 1,
    uSpeed: 0.3,
    uBendFactor: 0.003,
  },
  [Pipelines.simpleBlur]: {
    blur: 0.005,
  },
  [Pipelines.gaussianBlur]: {
    // TODO
  },
  [Pipelines.gaussianBlurPost]: {
    // TODO
  },
}

export const getWebGlRenderer = (scene: Scene) => scene.renderer as WebGLRenderer

export const addPipeline = (scene: Scene, name: string, instance: WebGLPipeline) =>
  getWebGlRenderer(scene).pipelines.add(name, instance)

export const addPostPipeline = (scene: Scene, name: string, _class: typeof PostFXPipeline) =>
  getWebGlRenderer(scene).pipelines.addPostPipeline(name, _class)

export const formPipelineCreateArgs = (type: PipelineName, frag: string) => ({
  [type]: [ frag, DEFAULT_PIPELINE_UNIFORMS[type] ],
})

const PIPELINE_ARGS = {
  ...formPipelineCreateArgs(Pipelines.basePost, undefined), // SPECIAL: use the default fragShader!

  ...formPipelineCreateArgs(Pipelines.cosmicGlow, frags.cosmicGlow),
  ...formPipelineCreateArgs(Pipelines.grayPost, frags.grayscale),
  ...formPipelineCreateArgs(Pipelines.distortionPost, frags.distortion1),
  ...formPipelineCreateArgs(Pipelines.distortion2Post, frags.distortion2),
  ...formPipelineCreateArgs(Pipelines.galaxy, frags.galaxy),
  ...formPipelineCreateArgs(Pipelines.galaxyPost, frags.galaxy),
  ...formPipelineCreateArgs(Pipelines.smokeGreenishPost, frags.smokeGreenish),
  ...formPipelineCreateArgs(Pipelines.textRecolor, frags.textRecolor1),
  ...formPipelineCreateArgs(Pipelines.textRecolorPost, frags.textRecolor1),
  ...formPipelineCreateArgs(Pipelines.bend, frags.bend),
  ...formPipelineCreateArgs(Pipelines.bendPost, frags.bend),
  ...formPipelineCreateArgs(Pipelines.hueRotate, frags.hueRotate),
  ...formPipelineCreateArgs(Pipelines.hueRotatePost, frags.hueRotatePost),
  ...formPipelineCreateArgs(Pipelines.simpleBlur, frags.simpleBlur),
  ...formPipelineCreateArgs(Pipelines.gaussianBlur, frags.gaussianBlur),
  ...formPipelineCreateArgs(Pipelines.gaussianBlurPost, frags.gaussianBlur),
}

/** Adds a pipeline or post pipeline for use in the scene */
export const pipelineFactory = (
  scene: Scene,
  name: string,
  isPostPipeline: boolean = false,
  uniforms?: TUniforms
): WebGLPipeline | PostFXPipeline => {
  if (!isPostPipeline && checkPipelineExists(scene, name, isPostPipeline)) {
    debugWarn('Pipeline already exists: ', name)
    return 
  }

  const pipelineArgs = PIPELINE_ARGS[name]

  if (!pipelineArgs) throw new Error('No configuration for pipeline: ' + name)

  pipelineArgs[1] = merge(pipelineArgs[1] as TUniforms, uniforms || {}) as any

  if (!isPostPipeline) {
    // TODO: check if such class already exists!
    
    const pipeline = createCustomPipeline.apply(null, [ scene.game, ...pipelineArgs ])

    // add it to the usable pipelines and return the instance
    const newPipelineInst = addPipeline(scene, name, pipeline) as WebGLPipeline

    return newPipelineInst
  } else {
    const PipelineClass = createCustomPostFxPipeline(
      scene.game,
      pipelineArgs[0] as string,
      name,
      pipelineArgs[1] as TUniforms
    )

    // add it to the usable pipelines
    addPostPipeline(scene, name, PipelineClass)
    // createPostPipelineInstance(scene, name)

    // return the instance
    return undefined
  }
}

export const checkPipelineExists = (scene: Scene, name: string, isPostPipeline = false) =>
  isPostPipeline
    ? getWebGlRenderer(scene).pipelines.getPostPipeline(name)
    : getWebGlRenderer(scene).pipelines.get(name)

export const checkPostPipelineExists = (scene: Scene, name: string) =>
  checkPipelineExists(scene, name, true)

export const createGrayScalePipeline = (game: Game) =>
  createCustomPipeline(game, frags.grayscaleNotPost, {
    gray: 1,
    factor: 0.1,
  })

export const createGrayScalePostPipeline = (game: Game) =>
  createCustomPostFxPipeline(game, frags.grayscale, {
    gray: 1,
  } as any)

export const createDistortionPostPipeline = (game: Game) =>
  createCustomPostFxPipeline(game, frags.distortion1, Pipelines.distortionPost)
// export const createDistortion2PostPipeline = (game: Game) => createCustomPostFxPipeline(game, frags.distortion2)

export const createPostPipelineInstance = (scene: Scene, key: string): PostFXPipeline =>
  getWebGlRenderer(scene).pipelines.getPostPipeline(key) as PostFXPipeline

export const findPostPipelineInstance = (scene: Scene, key: string) =>
  getWebGlRenderer(scene).pipelines.postPipelineClasses.get(key) as PostFXPipeline
export const findPipelineInstance = (scene: Scene, key: string) =>
  getWebGlRenderer(scene).pipelines.classes.get(key) as WebGLPipeline

export const createDistortionPipeline = (game: Game) =>
  createCustomPipeline(
    game,
    frags.distortion1,
    {
      // gray: 1,
      // factor: 0.1
    }
  )
