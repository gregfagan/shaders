import R from 'ramda';
import REGL, { Vec2 } from 'regl';
import { stream, event, log } from './stream';
import { stopwatch, seconds } from './clock';
import { glsl, uniform, ugui } from './tools';
import { quad } from './quad';
import { sdf } from './sdf';
import { glCoordinatesFromMouseEvent } from './utils';
import { GUI } from 'dat.gui';
import { streamProxy, AutoGUI } from './gui';

const regl = REGL();
const { canvas } = regl._gl;
const store = streamProxy();
const autoAdd = (gui: GUI, target: Record<string, unknown>) => {
  (['add', 'addColor'] as Extract<keyof GUI, 'add' | 'addColor'>[]).forEach(
    (method) => {
      const original = gui[method];
      gui[method] = <T>(defaultValue: T, name: string, ...args: any) => {
        target[name] = defaultValue;
        // @ts-expect-error
        return original.call(gui, target, name, ...args);
      };
    },
  );
  return gui as AutoGUI;
};
const gui = autoAdd(new GUI(), store);

// set up a clock which stops without focus
const hasFocus = stream.merge(
  stream(document.hasFocus()),
  stream
    .merge(event(window, 'focus'), event(window, 'blur'))
    .map(R.prop('type'))
    .map(R.equals('focus')),
);
const pause = hasFocus.map(R.not).map(log('pause'));
const clock = stopwatch(pause);

// track mouse
const mouse = stream.merge(
  stream.of<Vec2>([canvas.width / 2, canvas.height / 2]),
  event<MouseEvent>(canvas, 'mousemove').map(glCoordinatesFromMouseEvent),
);

// Change color every second
const color = stream.merge<REGL.Vec3, REGL.Vec3>(
  stream.of([0.1, 0.8, 0.5]),
  clock
    .pipe(seconds)
    .map(log('tick'))
    .map(() => [Math.random(), Math.random(), Math.random()]),
);

const draw = glsl`
${quad}
${sdf}
void main() {
  vec2 p = st();
  vec2 m = coord(${uniform(mouse)});
  float d = sdCircle(p - m, ${uniform(gui.add(0.1, 'u_radius', 0.1, 1))});
  d = step(0., d);
  vec3 color = mix(
    vec3(0),
    ${uniform(color, 'u_color', 'vec3')},
    1. - d
  );
  gl_FragColor = vec4(color, 1.);
}
`;
console.log(draw.frag);

const render = regl(draw);
stream.on(() => render(), clock);
