
// !!!!!!!!!!!!!!!!!1Corrected by jadis - https://www.facebook.com/jadis0
// Trapped by curiouschettai

//something like Mr.doob's zoom blur
//but no so cool

//by nikoclass

#ifdef GL_ES
precision highp float;
#endif

const int iterations = 50;

const vec3 day = vec3(0.2, 0.3, 0.5);
const vec3 night = vec3(0.1);

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 getColor(vec2 pos, vec2 m) {
	if(distance(pos, m) < 0.08) {
		return vec3(0.0);
	}
	if(length(pos) < 0.09) {
		return vec3(1.2, 1.1, 0.9);
	}

	float lm = length(m);
	if(lm < 0.5) {
		return mix(night, day, lm / 0.5);
	}
	return day;

}

float rand(float x) {
	float res = 0.0;

	for(int i = 0; i < 5; i++) {
		res += 0.240 * float(i) * sin(x * 0.68171 * float(i));

	}
	return res;

}

void main(void) {
	vec2 m = mouse - 0.5;
	float aspect = resolution.x / resolution.y;
	vec2 position = (gl_FragCoord.xy / resolution.xy) - 0.5;
	position.x *= aspect;
	m.x *= aspect;

	vec3 color = getColor(position, m);

	vec3 light = vec3(1.0);
	vec2 incr = position / float(iterations);
	vec2 p = vec2(0.0, 0.0) + incr;
	for(int i = 2; i < iterations; i++) {
		light += getColor(p, m);
		p += incr;
	}

	light /= float(iterations) * max(.01, dot(position, position)) * 40.0;

	vec2 star = gl_FragCoord.xy;
	if(rand(star.y * star.x) >= 2.1 && rand(star.y + star.x) >= .7) {
		float lm = length(m);
		if(lm < 0.15) {
			color = mix(vec3(2.0), day, lm / 0.15);
		}
	}

	if(distance(position, m) < 0.05) {
		color = vec3(0.0);
	}

	gl_FragColor = vec4(color + light, 1.0);

}