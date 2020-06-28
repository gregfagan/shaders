import { glsl } from './tools';
import { Uniforms, GLUniform } from './Uniforms';
import { observable } from 'mobx';
// import { u } from './gui';

// u.store.u_mouse = [0, 0];
// u.types.u_mouse = 'vec2';

const u = new Uniforms();
const mouse: GLUniform = observable({
  type: 'vec2',
  value: [0, 0],
});
u.values.u_mouse = mouse;

document.querySelector('canvas')?.addEventListener('mousemove', (e) => {
  mouse.value[0] = e.clientX * window.devicePixelRatio;
  mouse.value[1] =
    ((e.target as HTMLCanvasElement)?.clientHeight - e.clientY) *
    window.devicePixelRatio;
});

glsl`
float sdCircle(vec2 p) {
  return length(p);
}

void main() {
  vec2 mouse = coord(u_mouse);
  vec3 baseColor = ${u.color('base_color')};
  vec3 color = ${u.color('color', '#ffaaaa')};
  float d = sdCircle(st() - mouse);
  d = step(d, ${u.float('radius', 0.1)});
  gl_FragColor = vec4(mix(baseColor, color, d), 1.);
}
`(u);
