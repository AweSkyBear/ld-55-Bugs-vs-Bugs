#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float time;
uniform float u_value;
uniform sampler2D u_img_tex; // Use this for Image texture
uniform sampler2D u_lay_tex; // A layer texture
uniform float offsetX;
uniform float time_factor;
	
const float Pi = 100.;

const int   complexity      = 20;    // More points of color.
const float fluid_speed     = 400.0;  // Drives speed, higher number will make it slower.
const float color_intensity = 0.5;
void main()
{
  vec2 p=(2.0*gl_FragCoord.xy-resolution)/max(resolution.x,resolution.y);
  for(int i=1;i<complexity;i++)
  {
    vec2 newp=p + time*time_factor;
    newp.x+=0.6/float(i)*sin(float(i)*p.y+time/fluid_speed+ sqrt(time / 1000000.) *float(i)) + offsetX; // + mouse.y/mouse_factor+mouse_offset;
    newp.y+=0.6/float(i)*sin(float(i)*p.x+time/fluid_speed+0.3*float(i+10)) - 0.5; // - mouse.x/mouse_factor+mouse_offset;
    p=newp;
  }
  vec3 col=vec3(0.0,color_intensity*sin(33.0*p.y)+color_intensity,0.001*color_intensity*sin(p.x+p.y)+color_intensity);
  gl_FragColor=vec4(col, 1.0);
}