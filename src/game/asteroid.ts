import { range } from 'ramda';
import { vec2 } from 'gl-matrix';
import { glsl, uniform } from '../lib/gl/regl';
import { stream } from '../lib/stream';
import { dt, gui as baseGui, screenWrap, wrap } from './util';
import { Vec2 } from 'regl';

const gui = baseGui.addFolder('asteroid');

type Asteroid = {
  p: Vec2;
  v: Vec2;
  size: number;
};

/** random number in [-max, max] (default 1) */
const rand = (max = 1) => (Math.random() * 2 - 1) * max;

/** normalized then scaled vec2 */
const randVec2 = (scale = 1) =>
  vec2.scale(
    vec2.create(),
    vec2.normalize(vec2.create(), vec2.fromValues(rand(), rand())),
    scale
  );

const randomAsteroid = (): Asteroid => ({
  p: vec2.fromValues(rand(), rand()),
  v: randVec2(Math.random() * 0.25),
  size: Math.random(),
});

const move = (dt: number) => (a: Asteroid): Asteroid => ({
  ...a,
  p: vec2.add(vec2.create(), a.p, vec2.scale(vec2.create(), a.v, dt)).map(wrap),
});

const numAsteroids = 10;
const asteroidsRange = range(0, numAsteroids);

const asteroids = stream.scan(
  (asteroids, time) => asteroids.map(move(time)),
  asteroidsRange.map(randomAsteroid),
  dt
);

const asteroidUniforms = asteroidsRange.reduce((result, _, index) => {
  for (const key of Object.keys(asteroids()[index])) {
    result[`asteroids[${index}].${key}`] = () =>
      asteroids()[index][key as keyof Asteroid];
  }
  return result;
}, {} as Record<string, unknown>);

export const asteroidsConfig = glsl`
  ${{ uniforms: asteroidUniforms }}
  
  struct Asteroid { vec2 p; vec2 v; float size; };
  uniform Asteroid asteroids[${numAsteroids}];

  float sdAsteroid(vec2 p, Asteroid a) {
    float d = sdCircle(p - a.p, a.size * ${uniform(
      gui.auto(0.1, 'sizeScale', 0.1, 0.5)
    )} +
      ${uniform(gui.auto(0.2, 'sizeBase', 0.01, 0.2))});
    return d;
  }

  float sdAsteroids(vec2 p) {
    float d = INFINITY;
    for (int i = 0; i <= ${numAsteroids}; i+= 1) {
      d = opSmoothUnion(d, sdAsteroid(p, asteroids[i]), ${uniform(
        gui.auto(0.1, 'u_asteroidK', 0, 0.25)
      )});
    }
    return d;
  }

  float sdSpaceAsteroids(vec2 p) {
    float d = INFINITY;
    ${screenWrap(glsl`
      d = opSmoothUnion(d, sdAsteroids(p - pScreenWrap), u_asteroidK);
    `)}
    return d;
  }

  vec4 asteroidsColor(vec2 p) {
    float d = sdSpaceAsteroids(p);
    // d = step(0., d);
    float f = ${uniform(gui.auto(0.05, 'f', 0, 0.05))};
    float g = ${uniform(gui.auto(3, 'g', 0, 10))};
    d = -d;
    d = d / f;
    d = floor(d);
    d = d / g;
    // d /= 0.01;
    d = normalized(d);
    vec3 color = ${uniform(gui.auto('#d79552', 'asteroidColor'))};
    return vec4(color, d);
  }
`;
