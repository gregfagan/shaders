#iChannel0"self"
#iChannel0 :: MinFilter"Nearest"
#iChannel0 :: MagFilter"Nearest"

#define normalized(x)clamp(x, 0.0, 1.0)

vec2 fit(vec2 p) {
  return 2.0 * (p - 0.5 * iResolution.xy) / max(iResolution.x, iResolution.y);
}

float circle(vec2 p) {
  return length(p);
}

void main() {
  gl_FragColor = iMouseButton.x == 1.0&&floor(gl_FragCoord.xy) == vec2(2)
  ? vec4(iMouse.xy, iMouseButton.x, 1.0)
  : texture(iChannel0, vec2(2) / iResolution.xy);
}