#ifdef GL_ES
precision highp float;
#endif

// #extension GL_OES_standard_derivatives : enable

/*---------- USING HSV INSTEAD OF RGB FOR A COOL EFFECT ----------*/
// Conversion functions from Sam Hocevar's answer on:
// https://gamedev.stackexchange.com/questions/59797/glsl-shader-change-hue-saturation-brightness

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dist(vec2 a, vec2 b) {
    return sqrt(pow(a.x - b.x, 2.) + pow(a.y - b.y, 2.));
}

vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(void) {

    float asp = resolution.x / resolution.y;
    vec2 uv = vec2(gl_FragCoord.x / resolution.x * asp, gl_FragCoord.y / resolution.y);
    vec2 mse = vec2(time);

    float hue = dist(vec2(asp / 2., .5), uv) - mse.x * .54;
    vec3 temp = vec3(hue, 1., 1.);
    vec3 c = hsv2rgb(temp);

    gl_FragColor = vec4(c, 1.);

}