import REGL, { DrawConfig } from 'regl';
import { hasGUIController } from '../gui';
import { head, last } from 'ramda';
import { isColor, toGLColor } from './color';
import { ReadonlyVec2, ReadonlyVec3, ReadonlyVec4 } from 'gl-matrix';

type NamedConfig = [string, DrawConfig];
type GLSLTemplateParameter = string | number | DrawConfig | NamedConfig;

/**
 * Tagged template literal for writing fragment shaders.
 *
 * Template parameters can be regular strings (e.g. values from TS code)
 * REGL DrawConfigs, or NamedConfigs -- a tuple of [string, DrawConfig].
 *
 * Strings are spliced into the GLSL code as-is. The REGL configs will
 * be merged together, with the complete fragment shader as the final config.
 *
 * Tuple parameters are treated as both; this enables helper functions like
 * `uniform` below to set up a REGL config which manipulates a uniform, and
 * splice that uniform's name directly into the shader where it was used.
 */
export function glsl(
  template: TemplateStringsArray,
  ...parameters: Array<GLSLTemplateParameter>
): REGL.DrawConfig {
  // Convert all parameters to NamedConfigs by pairing strings with empty
  // DrawConfigs and DrawConfigs with empty strings. Simplifies processing
  // below.
  const namedConfigs = parameters.map(asNamedConfig);
  const name: (c: NamedConfig) => string = head;
  const config: (c: NamedConfig) => DrawConfig = last;

  // Generate fragment shader by concatenating all strings
  const frag = template.reduce((result, segment, index) => {
    const current = namedConfigs[index - 1];
    return `${result}${name(current)}${segment}`;
  });

  // Use a customized merge function to produce a final DrawConfig
  return [...namedConfigs.map(config), { frag }].reduce(reglMerge);
}

/** Convert template parameters to NamedConfigs */
function asNamedConfig(param: GLSLTemplateParameter): NamedConfig {
  if (typeof param === 'number') {
    return [param.toString(), {}];
  } else if (typeof param === 'string') {
    return [param, {}];
  } else if (typeof param === 'object' && !Array.isArray(param)) {
    return ['', param as REGL.DrawConfig];
  } else if (Array.isArray(param) && param.length === 2) {
    return param;
  }

  throw new Error('invalid glsl template parameter');
}

/**
 * Merges REGL DrawConfigs, concatenating strings (like shader code)
 * where necessary.
 *
 * TODO: stronger types
 */
export function reglMerge<T extends REGL.DrawConfig>(a: T, b: T) {
  return Object.entries(b).reduce(
    (result: any, [key, value]) => {
      result[key] =
        typeof value === 'string'
          ? (((result[key] as string) ?? '') + '\n' + value).trim()
          : typeof value === 'object' && value !== null
          ? { ...result[key], ...value }
          : value;
      return result;
    },
    { ...a }
  );
}

/**
 * Generate a NamedConfig for a uniform shader value.
 *
 * @param value a function returning a value or a GUIController
 * @param nameOrType name will be auto generated if not provided
 * @param type will be inferred if not provided
 * @returns the NamedConfig which provides this uniform to the shader
 *
 * TODO
 *
 *    Change to accept an AutoGUI, rather than a GUIController;
 *    return a curried function to fill in gui parameters, but
 *    give reasonable defaults. convert strings to colors.
 */
export function uniform<T extends keyof Value>(
  value: (() => Value[T]) | (() => string),
  nameOrType: string = generateName(),
  type?: T
): NamedConfig {
  const name = hasGUIController(value)
    ? value.controller.property
    : isType(nameOrType)
    ? generateName()
    : nameOrType;
  const getValue = isColor(value()) ? () => toGLColor(value()) : () => value();
  const finalType =
    type ?? (isType(nameOrType) ? nameOrType : inferType(getValue()));
  return [
    name,
    {
      frag: `uniform ${finalType} ${name};`,
      uniforms: { [name]: getValue },
    },
  ];
}

/** name generator for anonymous uniforms */
let nameId = 1;
export const generateName = () => `u_${nameId++}`;

/** Map GLSL types to JS types */
type Value = {
  float: number;
  int: number;
  bool: boolean;
  vec2: REGL.Vec2 | ReadonlyVec2;
  vec3: REGL.Vec3 | ReadonlyVec3;
  vec4: REGL.Vec4 | ReadonlyVec4;
};

const type: (keyof Value)[] = ['float', 'int', 'bool', 'vec2', 'vec3', 'vec4'];
const isType = (t: any): t is keyof Value => type.includes(t);

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

/** JS does not have an int type, so numbers are inferred as floats */
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
