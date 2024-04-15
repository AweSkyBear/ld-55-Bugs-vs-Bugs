#ifdef GL_ES
precision highp float;
#endif

uniform float time;  // NOTE!!!: Phaser updates exactly THIS ONE! - not uTime; BUT ONLY IF USED THROUGH A SHADER!
uniform float timeFactor;
// uniform vec2 mouse;
// uniform vec2 uResolution;

// Star Nest by Pablo Román Andrioli
// Modified a lot..

// This content is under the MIT License.

// TODO: EXPOSE UNIFORMS:
/*
	speed

#define iterations 19
#define formuparam 0.48516530


// 3 for just a backgroundy feeling
// 
	#define volsteps 8
	#define stepsize 0.1520


	#define brightness 0.001215
	#define darkmatter 0.49400
	#define distfading 0.760
	#define saturation 01.800
*/

/* CONFIG::: NOT MUCH STARS super clean (HEAVY):
	(shader quality DIV 2) - LIGHT
	(shader quality DIV 1) - HEAVY BUT NICEST
	#define volsteps 18
	iterations: 10


*/
/* CONFIG:::
 BLUEISH
				#define iterations 17
				#define formuparam 0.5390

				#define volsteps 15
				#define stepsize 0.137

				#define zoom   0.900
				#define tile   3.14950
				#define tile_adjuster 1.0
				#define speed  0.2

				#define brightness 0.0015
				#define darkmatter 0.400
				#define distfading 0.760
				#define saturation 0.800
*/
/*
	Configs: 
		iterations 12, volsteps 15, stepsize 0.1520
		NICE FAST AND BG - volsteps 8, iteration 19, stepsize 0.1520
			NICER: stepsize 0.3520
			REDDISH: stepsize 0.0520,
				regular shapes: stepsize 0.00020
				COSMIC FABRIC:SLOW - iterations 28 - 
*/
// 19 - original but slow / rich
// 19 + forumaparam 51 - VEERY RICH
// 19 + 0.45516530 - LIGHT AND RICH + SHADER Q 1 ->
// 12 - NICE with formuparam 0.58516530  ----> Not too full field
// 10 - not so dense

#define iterations 12 // int(uIterations)
#define volsteps 12 //int(uVolsteps)
// uniform int volsteps;

// uniform float stepsize, formuparam,

// #define iterations 12  // 
uniform float formuparam, stepsize;
// #define formuparam 0.58516530  // 0.48516 - ORIGINAL ; 0.43516530 - ENLIGHTNEED


// 3 for just a backgroundy feeling
// 8 - MY original; 12 - RICHER
#define volsteps  12	// even more a
// #define stepsize 0.1520

/**
#define iterations 10
#define formuparam 0.48516530

// 3 for just a backgroundy feeling
// 
#define volsteps 10
#define stepsize 0.1520
**/
uniform vec3 position;

uniform float zoom, tile, speed, brightness, darkmatter, distfading, saturation;

void main(void)
{
	float timeByFactor = time * timeFactor;
	vec2 uResolution;
	uResolution.xy = vec2(1400, 1400);
	//get coords and direction
	vec2 uv=gl_FragCoord.xy/uResolution.xy-.5;
	uv.y*=uResolution.y/uResolution.x;
	vec3 dir=vec3(uv*zoom,1.4);
	
	float a2=timeByFactor*speed+.15;
	float a1=10.0;
	mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
	mat2 rot2=rot1;//mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
	// dir.xz*=rot1;
	// dir.xy*=rot2;
	
	vec3 from=vec3(0.,0.,0.);
	vec2 dirVec=vec2(0.5,0.);

	from -= position - vec3(100., 100., 0.001); // initial pos
	// TIME CONTROLLED:::
	// from-=vec3(dirVec.x*timeByFactor,dirVec.y*timeByFactor,-2.);
	
	// from.x-=mouse.x;
	// from.y-=mouse.y;
	
	// from.xz*=rot1;
	// from.xy*=rot2;
	
	//volumetric rendering
	float s=.4,fade=.2;
	vec3 v=vec3(0.4);
	for (int r=0; r<volsteps / 2; r++) {
		vec3 p=from+s*dir*.35; // TODO: .35 - BETTER LESS GLIMMERING MINI LIGHTS // NOTE: less increases speed
		p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold 
		float pa,a=pa=1.4;
		for (int i=0; i<iterations; i++) { 
			p=abs(p)/dot(p,p)-formuparam; // the magic formula
			a+=abs(length(p)-pa); // absolute sum of average change
			pa=length(p);
		}
		float dm=max(0.,darkmatter-a*a*.001); //dark matter
		a*=a*a*2.; // add contrast
		if (r>3) fade*=1.-dm; // dark matter, don't render near
		//v+=vec3(dm,dm*.5,0.);
		v+=fade;
		v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
		fade*=distfading; // distance fading
		s+=stepsize;
	}
	v=mix(vec3(length(v)),v,saturation); //color adjust
	gl_FragColor = vec4(v*.01,1.3);	
	
}