
#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uMainSampler;
uniform float uTime;
uniform float uSpeed;
uniform float uBendFactor;

varying vec2 outTexCoord;
varying float outTexId;
varying vec4 outTint;
varying vec2 fragCoord;

void main() {
    float height = 1.0 - outTexCoord.y;
    float offset = pow(height, 2.5);

    offset *= (sin(uTime * uSpeed) * uBendFactor);

    vec4 texture = texture2D(uMainSampler, fract(vec2(outTexCoord.x + offset, outTexCoord.y)));

    gl_FragColor = texture;
}
