import REGL from 'regl';
import { reglMerge } from './utils';
import { gui } from './gui';

type Value = {
  float: number;
  int: number;
  bool: boolean;
  vec2: REGL.Vec2;
  vec3: REGL.Vec3;
  vec4: REGL.Vec4;
};

function isFloat(value: any): value is Value['float'] {
  return typeof value === 'number';
}

function isBool(value: any): value is Value['bool'] {
  return typeof value === 'boolean';
}

function isVec2(value: any): value is Value['vec2'] {
  return Array.isArray(value) && value.length === 2;
}

function isVec3(value: any): value is Value['vec2'] {
  return Array.isArray(value) && value.length === 3;
}

function isVec4(value: any): value is Value['vec2'] {
  return Array.isArray(value) && value.length === 4;
}

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

export function ugui<T>(name: string, defaultValue: T) {
  if (isFloat(defaultValue)) {
    return uniform(gui(name, defaultValue), name, 'float');
  } else if (isBool(defaultValue)) {
    return uniform(gui(name, defaultValue), name, 'bool');
  }
  throw new Error('bad uniform type');
}
