import { glsl, u } from './tools.js';

u.store.u_mouse = [0, 0];
u.types.u_mouse = 'vec2';

document.querySelector('canvas').addEventListener('mousemove', (e) => {
  u.store.u_mouse[0] = e.clientX * window.devicePixelRatio;
  u.store.u_mouse[1] =
    (e.target.clientHeight - e.clientY) * window.devicePixelRatio;
});

glsl`
float sdCircle(vec2 p) {
  return length(p);
}

void main() {
  vec2 mouse = coord(u_mouse);
  vec3 baseColor = ${u.c('base_color')};
  vec3 color = ${u.c('color', '#ffaaaa')};
  float d = sdCircle(st() - mouse);
  d = step(d, ${u.f('radius', 0.1)});
  gl_FragColor = vec4(mix(baseColor, color, d), 1.);
}
`;
