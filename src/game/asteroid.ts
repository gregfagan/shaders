import { range } from 'ramda';
import { glsl, uniform } from '../lib/gl/regl';
import { stream } from '../lib/stream';
import { dt, gui as baseGui, screenWrap, wrap } from './util';
import { Vec2 } from 'regl';
import { vec2 } from '../lib/math';
import { pipe } from 'fp-ts/lib/function';

const gui = baseGui.addFolder('asteroid');

type Asteroid = {
  p: Vec2;
  v: Vec2;
  size: number;
};

/** random number in [-max, max] (default 1) */
const rand = (max = 1) => (Math.random() * 2 - 1) * max;

/** normalized then scaled vec2 */
const randDirection = (scale = 1) =>
  pipe(
    Math.random() * Math.PI * 2,
    a => vec2.of(Math.sin(a), Math.cos(a)),
    v => vec2.scale(v, scale)
  );

const randomAsteroid = (): Asteroid => ({
  p: randDirection(Math.random() * 0.25 + 0.75),
  v: randDirection(Math.random() * 0.25),
  size: Math.random(),
});

const move = (dt: number) => ({ p, ...a }: Asteroid): Asteroid => ({
  ...a,
  p: pipe(p, p => vec2.add(p, vec2.scale(a.v, dt)), vec2.map(wrap)),
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
    d = -d;
    d = d * ${uniform(gui.auto(30, 'bandEffectScaleUp', 1, 50))};
    d = floor(d) + 1.;
    d = d / ${uniform(gui.auto(3, 'bandEffectScaleDown', 1, 10))};
    d = normalized(d);

    float stepD = step(sdSpaceAsteroids(p), 0.);
    float alpha = mix(d, stepD, ${uniform(gui.auto(0, 'bandOrStep', 0, 1))});
    
    return vec4(${uniform(gui.auto('#d79552', 'asteroidColor'))}, alpha);
  }
`;
