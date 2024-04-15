#define SHADER_NAME BEND_WAVES_FS

precision highp float;

uniform float uTime;

uniform float distortFactor1;
uniform float sinFactor1;
uniform float sinTimeFactor1;
uniform float distortFactor2;
uniform float sinFactor2;
uniform float sinTimeFactor2;

// TODO: PASS THIS FROM ABOVE : BOOL applyHueRotation
uniform bool applyHueRotation;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

void main(void) {
    // from hueRotation:
    // unimportant default since it will be recalculated if used
    mat4 hueRotation = mat4(1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0);

    if(applyHueRotation) {
        float c = cos(uTime * 1.);
        float s = sin(uTime * 1.);

        mat4 r = mat4(0.299, 0.587, 0.114, 0.0, 0.299, 0.587, 0.114, 0.0, 0.299, 0.587, 0.114, 0.0, 0.0, 0.0, 0.0, 1.0);
        mat4 g = mat4(0.701, -0.587, -0.114, 0.0, -0.299, 0.413, -0.114, 0.0, -0.300, -0.588, 0.886, 0.0, 0.0, 0.0, 0.0, 0.0);
        mat4 b = mat4(0.168, 0.330, -0.497, 0.0, -0.328, 0.035, 0.292, 0.0, 1.250, -1.050, -0.203, 0.0, 0.0, 0.0, 0.0, 0.0);

        hueRotation = r + g * c + b * s;

        mat4 defMatrix = mat4(1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0);
        float val = 0.5;

        // if 0.5 -> snow white
        mat4 defMatrix1 = mat4(val, val, val, val, val, val, val, val, val, val, val, val, val, val, val, val);
    }

    vec2 uv = outTexCoord;
    //uv.y *= -1.0;
    uv.y += (sin((uv.x + (uTime * distortFactor1)) * sinFactor1) * sinTimeFactor1) + (sin((uv.x + (uTime * distortFactor2)) * sinFactor2) * sinTimeFactor2);
    vec4 texColor = applyHueRotation ? texture2D(uMainSampler, uv) * hueRotation : texture2D(uMainSampler, uv);

    gl_FragColor = texColor;
}
