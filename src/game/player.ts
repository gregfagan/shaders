import { dt, gui as baseGui, keys, screenWrap, wrap } from './util';
import { stream } from '../lib/stream';
import { glsl, uniform } from '../lib/gl/regl';
import { Vec2 } from 'regl';
import { flow } from 'fp-ts/function';
import { mat2, vec2 } from '../lib/math';

const gui = baseGui.addFolder('player');

// movement
const vector = keys.map(
  ({ a: left, d: right, w: up, s: down }) =>
    [right ? 1 : left ? -1 : 0, up ? 1 : down ? 0 : 0] as Vec2
);

const angle = stream.scan(
  (angle, dt) => {
    const [input] = vector();
    return angle - input * gui.auto(1.5, 'rotate', 0.1, 2)() * Math.PI * dt;
  },
  0,
  stream.combine<number, number>(dt => (vector()[0] !== 0 ? dt() : undefined), [
    dt,
  ])
);

const down: Vec2 = [0, -1];
const direction = angle.map(
  flow(mat2.fromRotation, m => vec2.transformMat2(down, m))
);

const acceleration = dt.map(
  dt =>
    direction().map(
      x => x * (vector()[1] * gui.auto(0.05, 'acceleration', 0.025, 0.1)() * dt)
    ) as Vec2
);

const maxSpeed = gui.auto(0.02, 'maxSpeed', 0.005, 0.05);
const clampSpeed = maxSpeed.map(vec2.clampLength);

const velocity = stream.scan(
  flow(vec2.add, v => clampSpeed()(v)),
  [0, 0],
  acceleration
);

const position = stream.scan(flow(vec2.add, vec2.map(wrap)), [0, 0], velocity);

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
