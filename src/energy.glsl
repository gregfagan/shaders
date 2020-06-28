#iChannel0 "self"
#iChannel1 "file://mouse.glsl"
#iUniform float scale = 4 in { 1., 8.}

#define normalized(x) clamp(x, 0., 1.)

vec2 fit(vec2 p) {
  return 2. * (p - 0.5 * iResolution.xy) / max(iResolution.x, iResolution.y);
}

float circle(vec2 p) {
  return length(p);
}

float sdSegment( in vec2 p, in vec2 a, in vec2 b )
{
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}

void main() {
  vec2 uv = fit(gl_FragCoord.xy);
  // uv *= scale;
  // vec2 cell = uv;
  vec3 lastMouse = texture(iChannel1, vec2(0, 0)).xyz;

  vec3 color = vec3(0.);
  color = texture(iChannel0, gl_FragCoord.xy / iResolution.xy).rgb;
  // color -= 0.001 * color;
  color = 0.99 * color;
  color = clamp(color, vec3(0.), vec3(2.));
  if (iMouseButton.x > 0.) {
    // color += lastMouse.z * normalized(1. - pow(circle((uv - fit(iMouse.xy)) * 5.), 0.1));
    color += pow((1. - sdSegment(uv, fit(iMouse.xy), fit(lastMouse.xy))), 50.);
  }

  // vec2 a = vec2(-.5, 0.);
  // vec2 b = vec2(1., 1.);
  // color = pow((1. - sdSegment(uv, a, b)), 50.) * vec3(1.);
 
  // float isGridLine = max(step(0.98, abs(cell.x)), step(0.98, abs(cell.y)));
  // color = mix(color, vec3(1., 0., 0.), isGridLine);

  gl_FragColor = vec4(color, 1.);
}