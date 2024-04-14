import { Game } from "phaser";
import { forEach } from "~/common/func";
import { PostFXPipeline, Scene } from "~/common/types";
import { debugLog, setGlobalVar } from "./debug";
import { TARGET_FPS } from "./screen";

export type TFragShader = string;
export type TUniforms = Record<string, any> & {
  timeFactor?: number;
};

export const createCustomPipeline = <U extends TUniforms>(
  game: Game,
  fragShader,
  uniforms: U = {} as any
) => {
  return new CustomWebGlPipeline<U>(game, fragShader, uniforms as any);
};

type PipelineInst =
  | (PostFXPipeline & TUniforms)
  | (Phaser.Renderer.WebGL.Pipelines.SinglePipeline & TUniforms);

// const onPipelineRender = (inst: PipelineInst, scene: Scene) => {
//   inst.parentScene = scene
// }

const onPipelineBoot = (
  pipelineInst: PipelineInst,
  uniforms: TUniforms = {}
) => {
  const inst = pipelineInst;
  // important fix! - otherwise we get no color
  inst.set2f(
    "uResolution",
    inst.game.config.width as number,
    inst.game.config.height as number
  );

  // initial uniform values
  forEach((uniformKey) => {
    const value = uniforms[uniformKey];
    inst.set1f(uniformKey, value);
  }, Object.keys(uniforms));
};

const applyAndUpdateUniforms = <U>(
  inst: PipelineInst,
  uniforms: Partial<U>
) => {
  Object.keys(uniforms).forEach((propKey) => {
    const propValue = uniforms[propKey];
    inst.set1f(propKey, propValue); // NOTE: may NOT be 1f !!!
    inst.uniforms[propKey] = propValue; // manual update in the flags
  });
};

const setTimeUniform = (inst: PipelineInst, time: number) => {
  inst.set1f("uTime", time);
  inst.set1f("time", time);
};

const onPipelinePreRender = (pipelineInst: PipelineInst) => {
  const inst = pipelineInst;
  // setGlobalVar('pipInstText', inst.gameObject && inst.gameObject.text)
  // logGlobalVar('pipInstText')
  if (
    // COMMENT THIS OUT FOR NOW - the game object becomes active: false after the scene is restarted ???
    // NO: it's an old reference - not sure why
    // pathEq([ 'gameObject', 'active' ], false, inst) ||
    !inst.active //|| inst.gameObject && !inst.gameObject.scene.scene.isActive() // TODO:FIX LATER
  )
    return;

  if (inst.game) {
    const actualFps = 1000 / inst.game.loop.delta;
    const targetFPS = 60;

    const incrementTime = targetFPS / actualFps;

    const nextTime = inst.time + incrementTime / TARGET_FPS;
    inst.time = nextTime
    // inst.time = nextTime > 15 ? 0 : nextTime; // this is of no use
    setTimeUniform(inst, nextTime);
  }
};

setGlobalVar(setTimeUniform);

export interface ICustomFXPipeline<U> {
  setUniforms: (uniforms: U) => void;
  setTimeUniform: (timeValue: number) => void;
  uniforms: TUniforms;
  time: number;
}

export const asCustomPipeline = <U>(
  inst: PipelineInst | Phaser.Renderer.WebGL.WebGLPipeline
) => inst as any as ICustomFXPipeline<U>;

export const createCustomPostFxPipeline = <U extends TUniforms>(
  game: Game,
  fragShader: string,
  name: string,
  uniforms: U = {} as any
) => {
  const DEFAULT_UNIFORMS = { timeFactor: 1 };
  // this is instantiated by a class, not by an instance, that's why create a new class:
  return class CustomPostFxPipeline<U extends TUniforms>
    extends PostFXPipeline
    implements ICustomFXPipeline<U>
  {
    constructor() {
      super({
        game,
        renderTarget: true,
        // NOTE: do NOT pass a frag shader (or null) to fall back on the default shader,
        // e.g. if want to use color matrix
        fragShader,
        name,
        uniforms: [
          "uProjectionMatrix",
          "uMainSampler",
          "uTime",
          ...Object.keys(uniforms),
        ],
      } as any);
    }

    private _internalFpsCounter = 0;
    public uniforms: U = { ...DEFAULT_UNIFORMS, ...(uniforms as any) };
    public name = name;
    public time: number = 0;
    public active = true;
    public parentScene: Scene;

    /** Applies the uniforms to the shader and updates the `uniforms` object */
    public setUniforms(uniforms: U) {
      applyAndUpdateUniforms.bind(this)(this, uniforms);
    }

    public setTimeUniform(timeValue) {
      this.time = 0;
      setTimeUniform(this, timeValue);
    }

    public onBind(gameObject) {
      if (!this.gameObject) this.gameObject = gameObject;
    }
    public onPreRender() {
      onPipelinePreRender(this);
    }

    public onBoot() {
      onPipelineBoot(this, uniforms);
    }

    public onDraw(renderTarget) {
      // NOTE: this enables the use of this.colorMatrix !
      // super.onDraw.call(this, renderTarget)
      this.drawFrame(renderTarget, this.fullFrame1);
      this.bindAndDraw(this.fullFrame1);
    }
  };
};

/**
 * A custom utility class for creating custom pipelines
 * NOTE: this extends SinglePipeline instead of MultiPipeline which will work correctly on text objects
 */
export class CustomWebGlPipeline<U extends TUniforms>
  extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline
  implements ICustomFXPipeline<U>
{
  constructor(game: Game, fragShader: TFragShader, uniforms: U) {
    super({
      game,
      fragShader,
      uniforms: [
        "uProjectionMatrix",
        "uViewMatrix",
        "uModelMatrix",
        "uMainSampler",
        "uResolution",
        "uTime",
        ...Object.keys(uniforms),
      ],
    } as any);

    this.uniforms = uniforms;
  }

  private _internalFpsCounter = 0;
  public uniforms: U = {} as any;
  public time: number = 0;
  public gameObject: Phaser.GameObjects.GameObject;

  /** Applies the uniforms to the shader and updates the `uniforms` object */
  public setUniforms(uniforms: U) {
    applyAndUpdateUniforms(this, uniforms);
  }

  public setTimeUniform(timeValue) {
    this.time = timeValue;
    setTimeUniform(this, this.time);
  }

  public onBind(gameObject) {
    if (!this.gameObject) this.gameObject = gameObject;
  }

  public onPreRender() {
    // debugLog('ON PRERENDER', this.time)
    onPipelinePreRender(this);
  }

  public onBoot(...args) {
    debugLog(args);
    onPipelineBoot(this);
  }

  // onRender(scene: Scene) {
  //   onPipelineRender(this, scene)
  // }
}
