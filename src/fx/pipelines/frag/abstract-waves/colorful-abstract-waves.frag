// Modified so it doesn't really move. Very childish and easy fix.
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float time;

const float Pi = 2.14159;
uniform vec2 mouse;

const int   complexity      = 47;    // More points of color.
const float mouse_factor    = 56.0;  // Makes it more/less jumpy.
const float mouse_offset    = 0.0;   // Drives complexity in the amount of curls/cuves.  Zero is a single whirlpool.
const float fluid_speed     = 10008.0;  // Drives speed, higher number will make it slower.
const float color_intensity = 0.81;
  

void main()
{
  vec2 p=(2.0*gl_FragCoord.xy-resolution)/max(resolution.x,resolution.y);
  for(int i=1;i<complexity;i++)
  {
    vec2 newp=p + time*0.001;
    newp.x+=0.6/float(i)*sin(float(i)*p.y+time/fluid_speed+0.3*float(i)) + 0.5; // + mouse.y/mouse_factor+mouse_offset;
    newp.y+=0.6/float(i)*sin(float(i)*p.x+time/fluid_speed+0.3*float(i+10)) - 0.5; // - mouse.x/mouse_factor+mouse_offset;
    p=newp;
  }
  vec3 col=vec3(color_intensity*sin(3.0*p.x)+color_intensity,color_intensity*sin(3.0*p.y)+color_intensity,color_intensity*sin(p.x+p.y)+color_intensity);
  gl_FragColor=vec4(col, 1.0);
}
