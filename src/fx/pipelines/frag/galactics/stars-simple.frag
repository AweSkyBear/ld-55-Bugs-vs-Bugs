// https://glslsandbox.com/e#72806.2
#ifdef GL_ES
precision mediump float;
#endif

// #extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 nrand3(vec2 co) {
	vec3 a = fract(cos(co.x * 8.3e-3 + co.y) * vec3(1.3e5, 4.7e5, 2.9e5));
	vec3 b = fract(sin(co.x * 0.3e-3 + co.y) * vec3(8.1e5, 1.0e5, 0.1e5));
	vec3 c = mix(a, b, 0.5);
	return c;
}

void main(void) {

	vec2 uv = 2. * gl_FragCoord.xy / resolution.xy - 1.;
	vec2 uvs = uv * resolution.xy / max(resolution.x, resolution.y);
	vec3 p = vec3(uvs / 4., 0) + vec3(1., -1.3, 0.);
	p += .2 * vec3(sin(time / 16.), sin(time / 12.), sin(time / 128.));

	vec3 p2 = vec3(uvs / (4. + sin(time * 0.11) * 0.2 + 0.2 + sin(time * 0.15) * 0.3 + 0.4), 1.5) + vec3(2., -1.3, -1.);
	p2 += 0.25 * vec3(sin(time / 16.), sin(time / 12.), sin(time / 128.));

	vec3 p3 = vec3(p.y, p2.x, p.z);

	//Let's add some stars
	//Thanks to http://glsl.heroku.com/e#6904.0
	vec2 seed = p.xy * 2.0;
	seed = floor(seed * resolution.x);
	vec3 rnd = nrand3(seed);
	vec4 starcolor = vec4(pow(rnd.y, 40.0));

	//Second Layer
	vec2 seed2 = p2.xy * 3.0;
	seed2 = floor(seed2 * resolution.x);
	vec3 rnd2 = nrand3(seed2);
	starcolor += vec4(pow(rnd2.y, 40.0));

	//third Layer
	vec2 seed3 = p3.xy * 1.0;
	seed3 = floor(seed3 * resolution.x);
	vec3 rnd3 = nrand3(seed3);
	starcolor += vec4(pow(rnd3.y, 40.0)) * vec4(0.2 * p.x, p.y / p2.z, 1.0, 1.0);

	gl_FragColor = starcolor;

}