#iUniform float scale = 4 in { 1., 8.}

float circle(vec2 p) {
  return length(p);
}

void main() {
  vec2 uv = 2. * (gl_FragCoord.xy - 0.5 * iResolution.xy) / max(iResolution.x, iResolution.y);
  uv *= scale;
  vec2 cell = uv;
  vec3 color = vec3(0.);
  vec2 p = cell;
  cell = 2. * (fract(uv) - 0.5);
  float d = circle(p);
  color += step(d, 0.25) * vec3(1.);

  float isGridLine = max(step(0.98, abs(cell.x)), step(0.98, abs(cell.y)));
  // color = mix(color, vec3(1., 0., 0.), isGridLine);

  gl_FragColor = vec4(color, 1.);
}