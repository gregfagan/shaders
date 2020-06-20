import { glsl, u } from './tools.js';
const render = glsl`
float sdCircle(vec2 p) {
  return length(p);
}

void main() {
  vec2 uv = coord(gl_FragCoord.xy);
  vec3 baseColor = ${u.c('base_color')};
  vec3 color = ${u.c('color', '#ffaaaa')};
  float d = sdCircle(uv);
  d = step(d, 1.);
  gl_FragColor = vec4(mix(baseColor, color, d), 1.);
}
`;
// render();
