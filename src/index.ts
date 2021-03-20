import R from 'ramda';
import REGL from 'regl';
import { stream, log } from './tools/stream';
import { stopwatch, seconds } from './tools/stream/time';
import { Store } from './tools/stream/store';
import { documentHasFocus, mousePosition } from './tools/stream/dom';
import { glsl, uniform } from './tools/gl/regl';
import { quad } from './tools/gl/config/quad';
import { sdf } from './tools/gl/config/sdf';
import { AutoGUI } from './tools/gui';

const regl = REGL();
const { canvas } = regl._gl;

const store = new Store();
const gui = new AutoGUI({ store });

// set up a clock which stops without focus
const pause = documentHasFocus.map(R.not).map(log('pause'));
const clock = stopwatch(pause);

// track mouse
const mouse = mousePosition(canvas);

// Change color every second
const color = stream.merge<REGL.Vec3, REGL.Vec3>(
  stream.of([0.1, 0.8, 0.5]),
  clock.pipe(seconds).map(() => [Math.random(), Math.random(), Math.random()])
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
    ${uniform(color)},
    1. - d
  );
  gl_FragColor = vec4(color, 1.);
}
`;

const render = regl(draw);
stream.on(() => render(), clock);
