#define SHADER_NAME TEXT_RECOLOR_1

precision highp float;

uniform float uTime;
uniform sampler2D uMainSampler;
uniform vec2 resolution;
varying vec2 outTexCoord;

void main(void) {
    vec2 position = (gl_FragCoord.xy / resolution.xy);
    vec4 currentPixelColor = texture2D(uMainSampler, position);

    vec2 uv = outTexCoord;
    vec4 texColor = currentPixelColor; // texture2D(uMainSampler, uv) * vec4(1, 0, 0, 1);
    gl_FragColor = texColor;
}

// ////////

// // by @Flexi23

// #ifdef GL_ES
// precision highp float;
// #endif
// #define pi2_inv 0.159154943091895335768883763372
// uniform float time;
// uniform vec2 resolution;
// uniform sampler2D uMainSampler;
// varying vec2 outTexCoord;

// float border(vec2 uv, float thickness){
// 	uv = fract(uv - vec2(0.5));
// 	uv = min(uv, vec2(1.)-uv)*2.;
// //	return 1.-length(uv-0.5)/thickness;
// 	return clamp(max(uv.x,uv.y)-1.+thickness,0.,1.)/thickness;;
// }

// vec2 spiralzoom(vec2 domain, vec2 center, float n, float spiral_factor, float zoom_factor, vec2 pos){
// 	vec2 uv = domain - center;
// 	float d = length(uv);
// 	return vec2( atan(uv.y, uv.x)*n*pi2_inv + log(d)*spiral_factor, -log(d)*zoom_factor) + pos;
// }

// void main( void ) {
// 	vec2 uv = gl_FragCoord.xy / resolution.xy;
// 	uv = 0.5 + (uv - 0.5)*vec2(resolution.x/resolution.y,1.);

// 	uv = uv-0.5;

// 	vec2 spiral_uv = spiralzoom(uv,vec2(0.),8.,-.5,1.8,vec2(0.5,0.5)*time*0.5);
// 	vec2 spiral_uv2 = spiralzoom(uv,vec2(0.),3.,.9,1.2,vec2(-0.5,0.5)*time*.8);
// 	vec2 spiral_uv3 = spiralzoom(uv,vec2(0.),5.,.75,4.0,-vec2(0.5,0.5)*time*.7);

//     // vec4 texColor = texture2D(uMainSampler, uv) * vec4(1, 0, 0, 1);
// 	gl_FragColor = texture2D(uMainSampler, outTexCoord) * vec4(1, 0, 0, 1); // vec4(border(spiral_uv,0.9), border(spiral_uv2,0.9) ,border(spiral_uv3,0.9),1.);

// 	gl_FragColor *= 1.;
// }