#define SHADER_NAME BEND_FS

precision highp float;

uniform sampler2D uMainSampler;
uniform float uTime;
uniform float uSpeed;
uniform float uBendFactor;

varying vec2 outTexCoord;

void main()
{
    float height = 1.0 - outTexCoord.y;
    float offset = pow(height, 2.5);

    offset *= (sin(uTime * 0.3) * 0.003);

    vec4 texture = texture2D(uMainSampler, fract(vec2(outTexCoord.x + offset, outTexCoord.y)));

    gl_FragColor = texture;
}
