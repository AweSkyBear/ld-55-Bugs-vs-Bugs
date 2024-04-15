precision highp float;

uniform sampler2D uSampler;

varying vec2 outTexCoord;
varying vec4 outTint;

vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3846153846) * direction;
  vec2 off2 = vec2(3.2307692308) * direction;
  color += texture2D(image, uv) * 0.2270270270;
  color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;
  color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;
  return color;
}

vec4 blur5(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3333333333333333) * direction;
  color += texture2D(image, uv) * 0.29411764705882354;
  color += texture2D(image, uv + (off1 / resolution)) * 0.35294117647058826;
  color += texture2D(image, uv - (off1 / resolution)) * 0.35294117647058826;
  return color; 
}

vec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.411764705882353) * direction;
  vec2 off2 = vec2(3.2941176470588234) * direction;
  vec2 off3 = vec2(5.176470588235294) * direction;
  color += texture2D(image, uv) * 0.1964825501511404;
  color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
  color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;
  return color;
}


void main()
{
    // TODO: export as uniforms
    vec2 direction = vec2(0.000001);
    vec2 displacement = vec2(0.004);
    /*
      WOW: VERY NICE
        vec2 direction = vec2(0.000005);
        vec2 displacement = vec2(0.01);
    */
    vec2 uv = outTexCoord;
    vec4 result = blur13(uSampler, uv, displacement.xy, direction);
  
    // NOTE: to make brighter!
    // vec4 texture = texture2D(uSampler, outTexCoord);
    // texture = vec4(outTint.rgb * outTint.a, outTint.a);
    // gl_FragColor = result * texture;


    // can multiply the gl_FracColor multiple times
    // gl_FragColor = result * gl_FragColor;
    // gl_FragColor = result * gl_FragColor;
    // gl_FragColor = vec4(gl_FragColor.r, gl_FragColor.g, gl_FragColor.b, 0.5)//.a 
    // gl_FragColor = result * gl_FragColor;
    // gl_FragColor = result * gl_FragColor;
    // gl_FragColor = result * gl_FragColor;
    // gl_FragColor = result * gl_FragColor;

    // vec4 texture = texture2D(uSampler, outTexCoord);
    // texture = vec4(outTint.rgb * outTint.a, outTint.a);

    gl_FragColor = result;
    // gl_FragColor = vec4(result.r, result.g, result.b, 0.1);
}
