import R from 'ramda';
import './tools';
import { stream, event, log } from './stream';
import { stopwatch, seconds } from './clock';
import REGL from 'regl';
import { glsl, uniform, ugui } from './tools';
import { quad } from './quad';
import './gui';

const hasFocus = stream.merge(
  stream(document.hasFocus()),
  stream
    .merge(event(window, 'focus'), event(window, 'blur'))
    .map(R.prop('type'))
    .map(R.equals('focus')),
);

const pause = hasFocus.map(R.not).map(log('pause'));
const clock = stopwatch(pause);
const color = stream<REGL.Vec3>([0.5, 0.1, 0.9]);
clock
  .pipe(seconds)
  .map(log('clock'))
  .map(() => color([Math.random(), Math.random(), Math.random()]));

const render = REGL()(glsl`
  ${quad}

  float sdCircle(vec2 p, float r) {
    return length(p) - r;
  }

  void main() {
    float d = sdCircle(st(), ${ugui('u_radius', 1)});
    vec3 color = mix(
      vec3(0),
      ${uniform(color, 'color', 'vec3')},
      1. - d
    );
    gl_FragColor = vec4(color, 1.);
  }
  `);

color.map(render);

// --> kimberly and jonah
// --> antionette and winter (rain)
