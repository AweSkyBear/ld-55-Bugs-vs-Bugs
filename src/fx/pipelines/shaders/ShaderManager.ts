import { assocPath, defaultTo, path, prop } from "ramda";
import { setGlobalVar } from "~/common/debug";
import { TUniforms } from "~/common/fxPipeline";
import {
  DPR,
  getBiggerDimension,
  getScreenDprHeight,
  getScreenDprWidth,
  getSmallerDimension,
} from "~/common/screen";
import {
  BaseShader,
  Func,
  Image,
  Scene,
  SceneWithShaderManager,
  Shader,
} from "~/common/types";

export type TShaderKey = "galaxyShader";

export type TCreateShaderParams = {
  shaderName: TShaderKey;
  frag: string;
  vertShader?: string;
  defaultUniforms: Record<string, { type: string; value: any }>;
};

export type TSetShaderUniformsParams = {
  shaderKey: TShaderKey;
  uniforms: TUniforms;
};
export type TSetUniformsTweenedParams = {
  uniformsFrom: TUniforms;
  uniformsTo: TUniforms;
};

export type TAddShaderParams = {
  scene: Scene;
  shaderKey: TShaderKey;
  shaderScaleDownTimes: number;
  renderTxtKey: string;
};

export type TDefines = Record<string, any>;

export const createBaseShader: Func<TCreateShaderParams, BaseShader> = ({
  shaderName,
  frag,
  vertShader,
  defaultUniforms,
}) => {
  return new Phaser.Display.BaseShader(
    shaderName,
    frag,
    vertShader,
    defaultUniforms
  );
};

export interface IShaderManager {
  getBaseShaders: Func<never, TBaseShaders>;
  addBaseShader: Func<TCreateShaderParams, BaseShader>;
  getBaseShader: Func<TShaderKey, BaseShader>;
  getShader: Func<TShaderKey, TShaderConfig>;
  addShader: Func<TAddShaderParams, TShaderConfig>;
  setShaderUniforms: Func<TSetShaderUniformsParams, BaseShader>;
  tweenShaderUniforms: Func<TSetShaderUniformsParams, BaseShader>;
}

export type TSetUniformsParams = {
  uniforms: TUniforms;
  shaderConfig: TShaderConfig;
};

export type TBaseShaders = Partial<Record<TShaderKey, BaseShader>>;
export type TShaderConfig = {
  shader: Shader;
  baseShader: BaseShader;
  shaderKey: TShaderKey;
  shaderScaleDownTimes: number;
  renderTxtKey: string;
  renderTextureImage: Image;
  uniforms: TUniforms;
  // TODO: make generic!
  setUniforms: Func<TUniforms, void>;
  /** Heavier operation - recreates the shader due to the defines being static */
  setDefines: Func<TUniforms, void>;
  setUniformsTweened: Func<TSetUniformsTweenedParams, void>;
};
export type TShaders = Partial<Record<TShaderKey, TShaderConfig>>;

export const getShaderManager = (scene: SceneWithShaderManager) => {
  if (scene.shaderManager) {
    return scene.shaderManager;
  }

  const baseShaders: TBaseShaders = {};
  const shaders: TShaders = {};

  const addToStore = (params: TCreateShaderParams, shader: BaseShader) => {
    baseShaders[params.shaderName] = shader;
    return shader;
  };

  const updateAndApplyUniforms = ({
    shaderConfig,
    uniforms,
  }: TSetUniformsParams) => {
    Object.keys(uniforms).forEach((propDotSeparatedPath /*the propKey */) => {
      // TODO: RETAIN THE CURRENT UNIFORMS - not done currently!
      const propPath = propDotSeparatedPath.split(".");
      const propPathNormalized =
        propPath.length === 1 ? [...propPath, "value"] : propPath;
      const propValue = prop(propDotSeparatedPath, uniforms); // ||  path(propPath, uniforms);

      // apply the uniform to the shader
      shaderConfig.shader.uniforms = assocPath(
        propPathNormalized,
        propValue,
        shaderConfig.shader.uniforms
      );
      // store the new uniforms
      shaderConfig.uniforms = shaderConfig.shader.uniforms;
    });
  };

  /** NOTE: this adds a "fullscreen" shader! with option to scale down quality */
  const createShader = ({
    scene,
    baseShader,
    shaderScaleDownTimes,
    renderTxtKey,
  }: TAddShaderParams & { baseShader: BaseShader }) => {
    const shader = scene.add
      .shader(
        baseShader,
        -1,
        -1,
        getBiggerDimension() / shaderScaleDownTimes,
        getSmallerDimension() / shaderScaleDownTimes
      )
      .setOrigin(0, 0)
      .setZ(-10000);

    shader.setRenderToTexture(renderTxtKey); // 'txtShaderCosmicGlow')

    const img = scene.add
      .image(0, 0, renderTxtKey)
      .setAlpha(1)
      .setDisplaySize(getScreenDprWidth() * DPR, getScreenDprHeight() * DPR);
    return { shader, img };
  };
  const destroyShader = (shaderConfig: TShaderConfig) => {
    shaderConfig.shader.destroy(true);
    shaderConfig.renderTextureImage.destroy(true);
  };

  const result: IShaderManager = {
    getBaseShaders: () => baseShaders,
    getShader: (shaderKey: TShaderKey) => shaders[shaderKey],
    addBaseShader: (params: TCreateShaderParams) =>
      addToStore(params, createBaseShader(params)),
    getBaseShader: (shaderKey: TShaderKey) =>
      result.getBaseShaders()[shaderKey],
    setShaderUniforms: ({ shaderKey, uniforms }) => {
      // TODO
      return result.getBaseShader(shaderKey);
    },
    tweenShaderUniforms: ({ shaderKey, uniforms }) => {
      // LATER
      return result.getBaseShader(shaderKey);
    },
    addShader: ({ scene, shaderKey, shaderScaleDownTimes, renderTxtKey }) => {
      const baseShader = result.getBaseShader(shaderKey);

      const { shader, img } = createShader({
        scene,
        shaderKey,
        shaderScaleDownTimes,
        renderTxtKey,
        baseShader,
      });

      const shaderConfig: TShaderConfig = {
        shader,
        baseShader,
        renderTxtKey,
        renderTextureImage: img,
        shaderKey,
        shaderScaleDownTimes,
        uniforms: result.getBaseShader(shaderKey), // TODO: default uniforms?
        setUniforms: (u: TUniforms) =>
          updateAndApplyUniforms({
            shaderConfig,
            uniforms: u,
          }),
        setDefines: (d: TDefines) => {
          const DEFAULT_DEFINES = {
            shaderScaleDownTimes: 2
          }

          // PREF: alpha 0
          const getUpdateRegex = (defineName: string) =>
            new RegExp(`(#define ${defineName}\\s+)([\\d\\.]+)(.+)`, "gi");
          const getUpdateRegexReplacement = (defineValue: string) =>
            `$1${defineValue}$3`;
          const updateFragString = (defineName: string, defineValue: string) =>
            fragString.replace(
              getUpdateRegex(defineName),
              getUpdateRegexReplacement(defineValue)
            );

          let fragString = baseShader.fragmentSrc;
          Object.keys(d).forEach((key) => {
            const val = d[key];
            fragString = updateFragString(key, val);
          });
          /////// update the priceless fragString
          baseShader.fragmentSrc = fragString;

          /////// recreation code

          destroyShader(shaderConfig);
          const { shader, img } = createShader({
            scene,
            shaderKey,
            shaderScaleDownTimes: defaultTo(DEFAULT_DEFINES.shaderScaleDownTimes, d.shaderScaleDownTimes),
            renderTxtKey,
            baseShader,
          });
          shaderConfig.shader = shader;
          shaderConfig.renderTextureImage = img;

          img.setVisible(false)
          setTimeout(() => img.setVisible(true), 5)

          scene.children.sendToBack(shader);
          scene.children.sendToBack(img);

          // TODO: SET UNIFORMS TO THE CURRENT ONES - otehrwise - lost
          // BREAKING: shaderConfig.setUniforms(shaderConfig.uniforms)
          // updateAndApplyUniforms ?
          //////////////////////////////////// recreation code <-
        },
        setUniformsTweened: (u: TUniforms) => {
          // TODO !!!
        },
      };
      shaders[shaderKey] = shaderConfig;

      return shaderConfig;
    },
  };

  return result;
};

setGlobalVar(getShaderManager);
