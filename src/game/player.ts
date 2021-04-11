import R, { add, clamp, multiply, zipWith } from 'ramda';
import { mat2, vec2 } from 'gl-matrix';
import { dt, gui as baseGui, keys, screenWrap, wrap } from './util';
import { stream } from '../lib/stream';
import { glsl, uniform } from '../lib/gl/regl';
import { Vec2 } from 'regl';

const gui = baseGui.addFolder('player');

// movement
const vector = keys.map(
  ({ a: left, d: right, w: up, s: down }) =>
    [right ? 1 : left ? -1 : 0, up ? 1 : down ? 0 : 0] as Vec2
);

const angle = stream.scan(
  (angle, dt) => {
    const [input] = vector();
    return angle - input * gui.auto(1, 'rotate', 0.1, 2)() * Math.PI * dt;
  },
  0,
  stream.combine<number, number>(dt => (vector()[0] !== 0 ? dt() : undefined), [
    dt,
  ])
);

const dir = vec2.create();
const rot = mat2.create();
const down = vec2.fromValues(0, -1);
stream.on(() => {
  mat2.fromRotation(rot, angle());
  vec2.transformMat2(dir, down, rot);
}, angle);

const acceleration = dt.map(
  dt =>
    dir.map(
      multiply(vector()[1] * gui.auto(0.05, 'acceleration', 0.025, 0.1)() * dt)
    ) as vec2
);

const maxSpeed = gui.auto(0.025, 'maxSpeed', 0.01, 0.1);

const velocity = stream.scan<Vec2, Vec2>(
  R.pipe(zipWith(add), R.map(clamp(-maxSpeed(), maxSpeed()))),
  [0, 0],
  acceleration
);

const position = stream.scan<Vec2, Vec2>(
  R.pipe(zipWith(add), R.map(wrap)),
  [0, 0],
  velocity
);

export const playerConfig = glsl`
  mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
  }

  float sdPlayer(vec2 p) {
    vec2 pos = ${uniform(position)};
    vec2 center = vec2(0, 0.06);
    vec2 player = p - center - pos;
    player = rotate2d(${uniform(angle)}) * player;
    player += center + pos;
    float d = sdTriangleIsosceles(player - pos, vec2(0.035, 0.085)) - 0.015;

    return d;
  }

  float sdSpacePlayer(vec2 p) {
    float d = INFINITY;
    ${screenWrap(glsl`
      d = opUnion(d, sdPlayer(p - pScreenWrap));
    `)}
    return d;
  }

  vec4 playerColor(vec2 p) {
    float d = step(sdSpacePlayer(p), 0.);
    return vec4(vec3(1), d);
  }
`;
