precision highp float;

uniform sampler2D uSampler;

varying vec2 outTexCoord;

float blur = 0.003;
/* 
    Values:
    0.005 - quite blurred
    0.001 - just a bit

    0.05 - NOT blur but repetion multiple times through half the screen 
*/

void main()
{
    // vec4 texture = texture2D(uMainSampler, outTexCoord);


    vec4 sum = vec4(0.0);

    // TRIAL 1: very high multiplyer - cartoony effect
    // sum += texture2D(uSampler, vec2(outTexCoord.x - 4.0 * blur, outTexCoord.y)) * 0.935;
    // sum += texture2D(uSampler, vec2(outTexCoord.x - 3.0 * blur, outTexCoord.y)) * 0.939;
    // sum += texture2D(uSampler, vec2(outTexCoord.x - 2.0 * blur, outTexCoord.y)) * 0.9412;
    // sum += texture2D(uSampler, vec2(outTexCoord.x - blur, outTexCoord.y)) * 0.9415;
    // sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y)) * 0.9416;
    // sum += texture2D(uSampler, vec2(outTexCoord.x + blur, outTexCoord.y)) * 0.9415;
    // sum += texture2D(uSampler, vec2(outTexCoord.x + 2.0 * blur, outTexCoord.y)) * 0.9412;
    // sum += texture2D(uSampler, vec2(outTexCoord.x + 3.0 * blur, outTexCoord.y)) * 0.9209;
    // sum += texture2D(uSampler, vec2(outTexCoord.x + 4.0 * blur, outTexCoord.y)) * 0.9205;

    // blurX: 
    // sum += texture2D(uSampler, vec2(vTextureCoord.x - 4.0*blur, vTextureCoord.y)) * 0.05;
    // sum += texture2D(uSampler, vec2(vTextureCoord.x - 3.0*blur, vTextureCoord.y)) * 0.09;
    // sum += texture2D(uSampler, vec2(vTextureCoord.x - 2.0*blur, vTextureCoord.y)) * 0.12;
    // sum += texture2D(uSampler, vec2(vTextureCoord.x - blur, vTextureCoord.y)) * 0.15;
    // sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;
    // sum += texture2D(uSampler, vec2(vTextureCoord.x + blur, vTextureCoord.y)) * 0.15;
    // sum += texture2D(uSampler, vec2(vTextureCoord.x + 2.0*blur, vTextureCoord.y)) * 0.12;
    // sum += texture2D(uSampler, vec2(vTextureCoord.x + 3.0*blur, vTextureCoord.y)) * 0.09;
    // sum += texture2D(uSampler, vec2(vTextureCoord.x + 4.0*blur, vTextureCoord.y)) * 0.05;

    sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y - 4.0*blur)) * 0.05;
    sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y - 3.0*blur)) * 0.09;
    sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y - 2.0*blur)) * 0.12;
    sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y - blur)) * 0.15;
    sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y)) * 0.16;
    sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y + blur)) * 0.15;
    sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y + 2.0*blur)) * 0.12;
    sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y + 3.0*blur)) * 0.09;
    sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y + 4.0*blur)) * 0.05;


    gl_FragColor = sum;

    // texture *= vec4(outTint.rgb * outTint.a, outTint.a);

    // gl_FragColor = texture * plasma();
    
}


/**
CARTOONY: - high multiplyer: >0.9  and blur = 0
    precision highp float;
    varying vec2 outTexCoord;
    uniform float blur;
    uniform sampler2D uSampler;
    void main(void) {
        vec4 sum = vec4(0.0);
        sum += texture2D(uSampler, vec2(outTexCoord.x - 4.0 * blur, outTexCoord.y)) * 0.935;
        sum += texture2D(uSampler, vec2(outTexCoord.x - 3.0 * blur, outTexCoord.y)) * 0.939;
        sum += texture2D(uSampler, vec2(outTexCoord.x - 2.0 * blur, outTexCoord.y)) * 0.9412;
        sum += texture2D(uSampler, vec2(outTexCoord.x - blur, outTexCoord.y)) * 0.9415;
        sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y)) * 0.9416;
        sum += texture2D(uSampler, vec2(outTexCoord.x + blur, outTexCoord.y)) * 0.9415;
        sum += texture2D(uSampler, vec2(outTexCoord.x + 2.0 * blur, outTexCoord.y)) * 0.9412;
        sum += texture2D(uSampler, vec2(outTexCoord.x + 3.0 * blur, outTexCoord.y)) * 0.9209;
        sum += texture2D(uSampler, vec2(outTexCoord.x + 4.0 * blur, outTexCoord.y)) * 0.9205;
        gl_FragColor = sum;
    }


*/

/*

///////////////////
precision mediump float; // note this is ok with mediump precision it seems
// precision highp float;

varying vec2 outTexCoord;

// uniform float blur = 0.05;
float blur = 0.001;

uniform sampler2D uSampler;
void main(void) {
    vec4 sum = vec4(0.0);

    // TRIAL 1: very high multiplyer - cartoony effect
    // sum += texture2D(uSampler, vec2(outTexCoord.x - 4.0 * blur, outTexCoord.y)) * 0.935;
    // sum += texture2D(uSampler, vec2(outTexCoord.x - 3.0 * blur, outTexCoord.y)) * 0.939;
    // sum += texture2D(uSampler, vec2(outTexCoord.x - 2.0 * blur, outTexCoord.y)) * 0.9412;
    // sum += texture2D(uSampler, vec2(outTexCoord.x - blur, outTexCoord.y)) * 0.9415;
    // sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y)) * 0.9416;
    // sum += texture2D(uSampler, vec2(outTexCoord.x + blur, outTexCoord.y)) * 0.9415;
    // sum += texture2D(uSampler, vec2(outTexCoord.x + 2.0 * blur, outTexCoord.y)) * 0.9412;
    // sum += texture2D(uSampler, vec2(outTexCoord.x + 3.0 * blur, outTexCoord.y)) * 0.9209;
    // sum += texture2D(uSampler, vec2(outTexCoord.x + 4.0 * blur, outTexCoord.y)) * 0.9205;

    // blurX: 
    // sum += texture2D(uSampler, vec2(vTextureCoord.x - 4.0*blur, vTextureCoord.y)) * 0.05;
    // sum += texture2D(uSampler, vec2(vTextureCoord.x - 3.0*blur, vTextureCoord.y)) * 0.09;
    // sum += texture2D(uSampler, vec2(vTextureCoord.x - 2.0*blur, vTextureCoord.y)) * 0.12;
    // sum += texture2D(uSampler, vec2(vTextureCoord.x - blur, vTextureCoord.y)) * 0.15;
    // sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;
    // sum += texture2D(uSampler, vec2(vTextureCoord.x + blur, vTextureCoord.y)) * 0.15;
    // sum += texture2D(uSampler, vec2(vTextureCoord.x + 2.0*blur, vTextureCoord.y)) * 0.12;
    // sum += texture2D(uSampler, vec2(vTextureCoord.x + 3.0*blur, vTextureCoord.y)) * 0.09;
    // sum += texture2D(uSampler, vec2(vTextureCoord.x + 4.0*blur, vTextureCoord.y)) * 0.05;

    sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y - 4.0*blur)) * 0.05;
    sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y - 3.0*blur)) * 0.09;
    sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y - 2.0*blur)) * 0.12;
    sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y - blur)) * 0.15;
    sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y)) * 0.16;
    sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y + blur)) * 0.15;
    sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y + 2.0*blur)) * 0.12;
    sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y + 3.0*blur)) * 0.09;
    sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y + 4.0*blur)) * 0.05;


    gl_FragColor = sum;
}
*/