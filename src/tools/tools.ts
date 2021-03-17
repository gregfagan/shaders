import REGL from 'regl';
import { reglMerge } from './utils';
import { isGUIController } from './gui';
import { GUIController } from 'dat.gui';

type Value = {
  float: number;
  int: number;
  bool: boolean;
  vec2: REGL.Vec2;
  vec3: REGL.Vec3;
  vec4: REGL.Vec4;
};

const type: (keyof Value)[] = ['float', 'int', 'bool', 'vec2', 'vec3', 'vec4'];

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

  return [...configs.map(c => asNamedConfig(c)[1]), { frag }].reduce(reglMerge);
}

let nameId = 1;
const generateName = () => `unnamed_${nameId++}`;

const inferType = (v: unknown): keyof Value => {
  if (isFloat(v)) {
    return 'float';
  } else if (isBool(v)) {
    return 'bool';
  } else if (isVec2(v)) {
    return 'vec2';
  } else if (isVec3(v)) {
    return 'vec3';
  } else if (isVec4(v)) {
    return 'vec4';
  }
  throw new Error('could not infer uniform type');
};

const isType = (t: any): t is keyof Value => type.includes(t);

//
//
// TODO
//
//    Change to accept an AutoGUI, rather than a GUIController;
//    return a curried function to fill in gui parameters, but
//    give reasonable defaults. convert strings to colors.
//
//
export function uniform<T extends keyof Value>(
  value: (() => Value[T]) | GUIController,
  nameOrValue: string = generateName(),
  type?: T
): NamedConfig {
  const name = isGUIController(value)
    ? value.property
    : isType(nameOrValue)
    ? generateName()
    : nameOrValue;
  const getValue = isGUIController(value)
    ? () => (value.object as Record<string, unknown>)[name]
    : () => value();
  const finalType =
    type ?? (isType(nameOrValue) ? nameOrValue : inferType(getValue()));
  return [
    name,
    {
      frag: `uniform ${finalType} ${name};`,
      uniforms: { [name]: getValue },
    },
  ];
}
