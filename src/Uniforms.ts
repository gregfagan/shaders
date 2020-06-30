import { observable, computed } from 'mobx';
import { GUI } from 'dat.gui';
import { Vec3, Vec2 } from 'regl';

function toHex(color: number) {
  const hex = Math.round(color * 255).toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

function fromGLColor([r, g, b]: Vec3) {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function toGLColor(guiColor: string): Vec3 {
  const test = guiColor.match(/^#([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})$/i);
  if (test === null) {
    throw new Error('cannot read color');
  }
  return [
    parseInt(test[1], 16) / 255,
    parseInt(test[2], 16) / 255,
    parseInt(test[3], 16) / 255,
  ];
}

export type GLUniform =
  | { type: 'float'; value: number }
  | { type: 'vec2'; value: Vec2 }
  | { type: 'vec3'; value: Vec3 }
  | { type: 'color'; value: Vec3 };

type UniformStore = Record<string, GLUniform>;
export type GLUniforms = Record<string, GLUniform['value']>;

export class Uniforms {
  gui = new GUI();
  unnamed = 1;
  @observable values: UniformStore = {};
  guiValues = guiUniformProxy(this.values);
  glValues = glUniformProxy(this.values);

  generateName() {
    return `unnamed_${this.unnamed++}`;
  }

  float(
    name = this.generateName(),
    defaultValue = 0,
    min = 0,
    max = 1,
    step = 0.01,
  ) {
    this.values[name] = { type: 'float', value: defaultValue };
    this.gui.add(this.guiValues, name, min, max, step);
    return name;
  }

  color(name = this.generateName(), defaultValue = '#888888') {
    this.values[name] = { type: 'color', value: toGLColor(defaultValue) };
    this.gui.addColor(this.guiValues, name);
    return name;
  }

  @computed get header() {
    return Object.entries(this.glValues).reduce((header, [name, uniform]) => {
      const declaration = `uniform ${uniform.type} ${name};`;
      return `${header}\n${declaration}`;
    }, '');
  }

  @computed get props() {
    return Object.entries(this.glValues).reduce((props, [name, uniform]) => {
      props[name] = uniform.value;
      return props;
    }, {} as GLUniforms);
  }
}

function guiUniformProxy(store: UniformStore) {
  return new Proxy(store, {
    get(values, name: string) {
      const u = values[name];
      return u.type === 'color' ? fromGLColor(u.value) : u.value;
    },
    set(values, name: string, value: string | number) {
      const u = values[name];
      if (u === undefined)
        throw new Error('cannot set a new uniform through guiValues');
      if (typeof value === 'string') {
        if (u.type !== 'color')
          throw new Error('can only set a string to a color');
        u.value = toGLColor(value);
      } else {
        u.value = value;
      }
      return true;
    },
  });
}

function glUniformProxy(store: UniformStore) {
  return new Proxy(store, {
    get(values, name: string) {
      const u = values[name];
      return u.type === 'color' ? { type: 'vec3', value: u.value } : u;
    },
  });
}
