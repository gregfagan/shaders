import { Shader } from './Shader';

const { glsl, prop, canvas, float, color } = new Shader();

glsl`
float sdCircle(vec2 p) {
  return length(p);
}

void main() {
  vec2 mouse = coord(${prop({
    name: 'u_mouse',
    type: 'vec2',
    value: [0, 0],
    script: (mouse) => {
      canvas.addEventListener('mousemove', (e) => {
        mouse.value[0] = e.clientX * window.devicePixelRatio;
        mouse.value[1] =
          (canvas.clientHeight - e.clientY) * window.devicePixelRatio;
      });
    },
  })});
  vec3 baseColor = ${color('base_color')};
  vec3 color = ${color('color', '#ffaaaa')};
  float d = sdCircle(st() - mouse);
  d = step(d, ${float('radius', 0.1)});
  gl_FragColor = vec4(mix(baseColor, color, d), 1.);
}
`;
