#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define pi radians(180.)

float circle(vec2 coords, float x, float y, float rad, float sharp){
	return 1.-smoothstep(distance(coords,vec2(x,y))/rad,0.,1.)*sharp;
}










vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float noise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);}









void main( void ) {
	
	
	float asp = resolution.x/resolution.y;
	vec2 uv = (gl_FragCoord.xy/resolution.xy);
	uv.x*=asp;
	vec2 mse = vec2(mouse.x*asp,mouse.y);
	
	vec3 col = vec3(0.);
	vec3 Comp = col;
	
	for(float i=-pi; i<=pi; i+=pi/70.){
		
		col.g += circle(uv,.1*noise(uv+time)+asp/2.-cos(i)*.5,.1*noise(uv-time)+.5-sin(i)*.4,.03,.9);
		Comp = max(Comp,col);
		col = vec3(0.);
	}
	
	gl_FragColor = vec4(Comp,1.);
}