// https://glslsandbox.com/e#72457.0

#ifdef GL_ES

precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
#define iTime time
#define iResolution resolution

float field(in vec3 p) {
	float strength = 7.6 + .03 * log(2.e-6 + fract(sin(iTime) * 5373.11));
	float accum = 0.;
	float prev = 1.;
	float tw = 0.5;
	for(int i = 0; i < 22; ++i) {
		float mag = dot(p, p);
		p = abs(p) / mag + vec3(-.5, -0.1, -1.5);
		float w = exp(-float(i) / 5.);
		accum += w * exp(-strength * pow(abs(mag - prev), 2.3));
		tw += w;
		prev = mag;
	}
	return max(0., 5. * accum / tw - .7);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 uv = 2. * fragCoord.xy / iResolution.xy - 1.;
	vec2 uvs = uv * iResolution.xy / max(iResolution.x, iResolution.y);
	vec3 p = vec3(uvs / 4.5, 0) + vec3(1., -1.3, 0.);
	p += .2 * vec3(sin(iTime / 10.5), sin(iTime / 12.), sin(iTime / 228.));
	float t = field(p);
	float v = (1.111 - exp((abs(uv.x) - 1.6) * 6.)) * (1. - exp((abs(uv.y) - 1.) * 6.));
	fragColor = mix(14.4, 1.4, v) * vec4(1.4 * t * t * t, 1.4 * t * t, t, 2.0);
}
