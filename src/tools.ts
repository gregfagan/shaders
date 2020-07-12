import REGL from 'regl';
import { reglMerge } from './utils';
import { quad } from './quad';
import { stream, event, log } from './stream';
import { seconds, stopwatch } from './clock';
import R from 'ramda';
import flyd from 'flyd';

type Value = {
  float: number;
  int: number;
  bool: boolean;
  vec2: REGL.Vec2;
  vec3: REGL.Vec3;
  vec4: REGL.Vec4;
};

type NamedConfig = [string, REGL.DrawConfig];
type Config = NamedConfig | REGL.DrawConfig;

function hasName(config: Config): config is NamedConfig {
  return Array.isArray(config) && config.length >= 2;
}

function getName(config: Config) {
  return hasName(config) ? config[0] : '';
}

function getConfig(config: Config) {
  return hasName(config) ? config[1] : config;
}

export function glsl(
  template: TemplateStringsArray,
  ...configs: Array<REGL.DrawConfig | NamedConfig>
): REGL.DrawConfig {
  const frag = template.reduce((result, segment, index) => {
    const config = configs[index - 1];
    return `${result}${getName(config)}${segment}`;
  });

  return [...configs.map(getConfig), { frag }].reduce(reglMerge);
}

export function uniform<T extends keyof Value>(
  value: () => Value[T],
  name: string,
  type: T,
): NamedConfig {
  return [
    name,
    {
      frag: `uniform ${type} ${name};`,
      uniforms: { [name]: () => value() },
    },
  ];
}

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
  void main() {
    gl_FragColor = vec4(${uniform(color, 'color', 'vec3')}, 1.);
  }
  `);

color.map(render);
