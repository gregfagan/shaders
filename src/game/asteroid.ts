import { range } from 'ramda';
import { vec2 } from 'gl-matrix';
import { glsl } from '../tools/gl/regl';
import { stream } from '../tools/stream';
import { dt, wrap } from './util';
import { Vec2 } from 'regl';

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
  size: Math.random() * 0.06 + 0.02,
});

const move = (dt: number) => (a: Asteroid): Asteroid => ({
  ...a,
  p: vec2.add(vec2.create(), a.p, vec2.scale(vec2.create(), a.v, dt)).map(wrap),
});

const numAsteroids = 8;
const asteroidsRange = range(0, numAsteroids);

const asteroids = stream.scan(
  (asteroids, time) => {
    return asteroids.map(move(time));
  },
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
    float d = sdCircle(p - a.p, a.size);
    return d;
  }

  float sdAsteroids(vec2 p) {
    float d = INFINITY;
    for (int i = 0; i <= ${numAsteroids}; i+= 1) {
      d = opUnion(d, sdAsteroid(p, asteroids[i]));
    }
    return d;
  }
`;
