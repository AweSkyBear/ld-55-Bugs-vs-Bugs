// https://glslsandbox.com/e#72697.1
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

mat2 m = mat2( 0,  0, 0.70,  1.00 );

float hash( float n )
{
    return fract(sin(n)*758.5453)*2.;
}

float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x); 
    //f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + p.z*800.0;
    float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x), mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
		    mix(mix( hash(n+800.0), hash(n+801.0),f.x), mix( hash(n+857.0), hash(n+858.0),f.x),f.y),f.z);
    return res;
}

float fbm(vec3 p)
{
    float f = 0.0;
    f += 0.50000*noise( p ); p = p*2.02+0.15;
    f -= 0.25000*noise( p ); p = p*2.03+0.15;
    f += 0.12500*noise( p ); p = p*2.01+0.15;
    f += 0.06250*noise( p ); p = p*2.04+0.15;
    f -= 0.03125*noise( p );
    return f/0.984375;
}

float cloud(vec3 p)
{
	p-=fbm(vec3(p.x,p.y,0.0)*0.5)*0.7;
	
	float a =0.0;
	a-=fbm(p*3.0)*2.2-1.1;
	if (a<0.0) a=0.0;
	a=a*a;
	return a;
}

vec3 f2(vec3 c)
{
	c+=hash(gl_FragCoord.x+gl_FragCoord.y*9.9)*0.01;
	
	
	c*=0.7-length(gl_FragCoord.xy / resolution.xy -0.5)*0.7;
	float w=length(c);
	c=mix(c*vec3(0,0,0),vec3(w,w,w)*vec3(0,2,1.0),w*1.1-0.2);
	return c;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) ;
	position.y+=0.2;

	vec2 coord= 3.*surfacePosition;//vec2(position*19.6);
	
	
	
	coord+=fbm(vec3(coord*18.0,time*0.001))*0.07;
	//coord+=time*0.0171;
	
	
	float q = cloud(vec3(coord*1.0,0.222));
	coord+=time*0.0171;
	q += cloud(vec3(coord*0.6,0.722));
	coord+=time*0.0171;
	q += cloud(vec3(coord*0.3,0.722));
	coord+=time*0.1171;
	q += cloud(vec3(coord*0.1,0.722));
	
	

vec3 	col = vec3(0.7,0,0) + vec3(q*vec3(0.7,0,0));
	gl_FragColor = vec4( f2(col), 1.0 );

}