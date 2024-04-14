#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float lfo(float x1,float x2,float f)
{
	return (sin(time*f)/2.0+0.5)*(x2-x1)+x1;
}


void main( void ) {

	vec2 q = ( gl_FragCoord.xy / resolution.y );
	vec2 p = (gl_FragCoord.xy/ resolution.y - vec2(resolution.x/resolution.y/2.0,0.5))*5.0;
	
	
	float a = lfo(0.1,1.5,0.8);
	float b = lfo(1.0,3.0,0.01);
	float c = lfo(0.0,10.0,0.05);
	float d = lfo(0.1,100.0,0.85);
	float e = lfo(0.01,0.1,0.45);
	
	float r = sqrt(p.x*p.x+p.y*p.y);
	
	float th = atan(p.y,p.x);
	float color;
	float rf;	
	for(float dh=0.0;dh<=3.0;dh++)
	{
		rf = a*pow(cos(b*(th+dh*6.28)+c),d)+e;
		color += 0.005/abs(r-rf);
	}
	
	gl_FragColor = vec4(color,0.0,0.0, 1.0 );

}