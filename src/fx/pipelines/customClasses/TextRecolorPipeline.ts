/** NOTE: for reference purposes only - not used */
const frag = `
precision highp float;

uniform sampler2D uMainSampler;
uniform vec2 uResolution;
uniform float uTime;

varying vec2 outTexCoord;
varying vec4 outTint;

vec4 plasma()
{
    vec2 pixelPos = gl_FragCoord.xy / uResolution * 20.0;
    float freq = 0.8;
    float value =
        sin(uTime + pixelPos.x * freq) +
        sin(uTime + pixelPos.y * freq) +
        sin(uTime + (pixelPos.x + pixelPos.y) * freq) +
        cos(uTime + sqrt(length(pixelPos - 0.5)) * freq * 2.0);

    return vec4(
        cos(value),
        sin(value),
        sin(value * 3.14 * 2.0),
        cos(value)
    );
}

void main()
{
    vec4 texture = texture2D(uMainSampler, outTexCoord);

    texture *= vec4(outTint.rgb * outTint.a, outTint.a);

    gl_FragColor = texture * plasma();
}
`

export default class TextRecolorPipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
  constructor(game) {
    super({
      game: game,
      fragShader: frag,
      uniforms: [
        'uProjectionMatrix',
        'uViewMatrix',
        'uModelMatrix',
        'uMainSampler',
        'uResolution',
        'uTime',
      ],
    } as any) //Phaser.Renderer.WebGL.Pipelines.SinglePipeline & {uniforms: any})
  }

  public speed = 1

  onBoot() {
    // TODO: in the pipelineFactory !
    // this.set2f('uResolution', game.config.width, game.config.height);
  }

  onPreRender ()
  {
      this.set1f('uTime', (this.game.loop.time / 1000) * this.speed);
  }
}
