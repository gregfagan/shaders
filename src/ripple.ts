import { Shader } from './Shader';
import { autorun, observable } from 'mobx';

const { glsl, canvas, gui, prop, float, color } = new Shader();

const options = observable({
  animate: true,
});

gui.add(options, 'animate');

prop({
  name: 'u_time',
  type: 'float',
  value: 0,
  script: (time) => {
    let raf: number;
    let lastTime = 0;
    let t = 0;
    const update = (elapsed: number) => {
      const dt = (elapsed - lastTime) / 1000;
      t += dt;
      lastTime = elapsed;
      time.value = t;
      raf = requestAnimationFrame(update);
    };
    autorun(() => {
      if (options.animate) {
        lastTime = performance.now();
        update(lastTime);
      } else {
        cancelAnimationFrame(raf);
      }
    });
  },
});

prop({
  name: 'u_mouse',
  type: 'vec2',
  value: [canvas.clientWidth / 2, canvas.clientHeight / 2],
  script: (mouse) => {
    canvas.addEventListener('mousemove', (e) => {
      mouse.value[0] = e.clientX * window.devicePixelRatio;
      mouse.value[1] =
        (canvas.clientHeight - e.clientY) * window.devicePixelRatio;
    });
  },
});

glsl`
float sdCircle(vec2 p) {
  return length(p);
}

void main() {
  vec2 mouse = coord(u_mouse);
  vec3 baseColor = ${color('base_color')};
  vec3 color = ${color('color', '#ffaaaa')};
  float d = sdCircle(st() - mouse);
  d = step(d, ${float('radius', 0.05)} + 0.015 * sin(u_time * 5.));
  gl_FragColor = vec4(mix(baseColor, color, d), 1.);
}
`;
