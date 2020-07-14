import REGL from 'regl';
import { reglMerge } from './utils';
import { gui, AddGuiArgs } from './gui';

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
type GLSLTemplateParameter = REGL.DrawConfig | NamedConfig | string;

function asNamedConfig(param: GLSLTemplateParameter): NamedConfig {
  if (typeof param === 'string') {
    return [param, {}];
  } else if (typeof param === 'object' && !Array.isArray(param)) {
    return ['', param as REGL.DrawConfig];
  } else if (Array.isArray(param) && param.length === 2) {
    return param;
  }

  throw new Error('invalid glsl template parameter');
}

export function glsl(
  template: TemplateStringsArray,
  ...configs: Array<GLSLTemplateParameter>
): REGL.DrawConfig {
  const frag = template.reduce((result, segment, index) => {
    const [name] = asNamedConfig(configs[index - 1]);
    return `${result}${name}${segment}`;
  });

  return [...configs.map((c) => asNamedConfig(c)[1]), { frag }].reduce(
    reglMerge,
  );
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

export function ugui<T>(name: string, defaultValue: T, ...args: AddGuiArgs) {
  if (isFloat(defaultValue)) {
    return uniform(gui(name, defaultValue, ...args), name, 'float');
  } else if (isBool(defaultValue)) {
    return uniform(gui(name, defaultValue), name, 'bool');
  }
  throw new Error('bad uniform type');
}
