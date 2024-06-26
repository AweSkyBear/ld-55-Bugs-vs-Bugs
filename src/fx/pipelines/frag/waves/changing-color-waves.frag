precision highp float;
uniform float time;
uniform vec2 resolution;

#define TAU radians(360.)
#define MAX_ITER 4

void main( void ) {
	float t = time * .5+23.0;
	vec2 uv = gl_FragCoord.xy / resolution.xy;
    	vec2 p = mod(uv*TAU, TAU)-250.0;
	vec2 i = vec2(p);
	float c = 1.0;
	float inten = .005;

	for (int n = 1; n < MAX_ITER; n++) 
	{
		float t = t * (1.0 - (3.5 / float(n+1)));
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
		c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
	}
	c /= float(MAX_ITER);
	c = 1.17-pow(c, 1.4);
	vec3 colour = vec3(pow(abs(c), 8.0));
    	colour = clamp(colour + vec3(0.0, 0.35, 0.5), 0.0, 1.0);
	float a = time*.5;
	mat3 rm = mat3(0,1,1, 
		       1,cos(a),-sin(a),
		       1,sin(a),cos(a));
	gl_FragColor = vec4(rm*colour, 1.0);
}

