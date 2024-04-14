#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sdSphere(vec3 p, float r) {
    float d = length(p) - r  - cos(p.x)*sin(time + p.x+p.y)*sin(time* abs(cos(p.x/time)))*10.;
    return d;
}

vec3 getNormal(vec3 pos, float size)
{
    float delta = 0.0001;
    return normalize(vec3(
            sdSphere(pos, size) - sdSphere(vec3(pos.x - delta, pos.y, pos.z), size),
            sdSphere(pos, size) - sdSphere(vec3(pos.x, pos.y - delta, pos.z), size),
            sdSphere(pos, size) - sdSphere(vec3(pos.x, pos.y, pos.z - delta), size)
        ));
}

void main( void ) {
    vec2 p = ( gl_FragCoord.xy * 2. - resolution.xy ) / min(resolution.x, resolution.y);
    float cameraX = (sin(time / 1.0));
    float cameraY = (cos(time / 1.0));
    // vec3 cameraPos = vec3(0., 0., -5.);
    vec3 cameraPos = vec3(0.0, 0.0, -140.0);
    float screenZ = 2.5;
    vec3 rayDirection = normalize(vec3(p, screenZ));
    float sphereRadius = 50.0;
    vec3 lightDir = normalize(-vec3(cameraPos.xy, 0.8));
    vec3 lightCol = vec3(1.0);

    float depth = 0.0;

    vec3 col = vec3(0.0);

    for (int i = 0; i < 99; i++) {
        vec3 rayPos = cameraPos + rayDirection * depth;
        float dist = sdSphere(rayPos, sphereRadius);

        if (dist < 0.0001) {
            vec3 normal = getNormal(rayPos, sphereRadius);
            float diff = dot(normal, lightDir);

            // col = vec3(1.);
            col = vec3(diff) * lightCol;
            break;
        }

        depth += dist;
    }

    gl_FragColor = vec4(col, 1.0);
}
