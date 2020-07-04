import { observable, computed, autorun } from 'mobx';
import { GUI } from 'dat.gui';
import REGL, { Vec3, Vec2 } from 'regl';
import {
  reglMerge,
  reduceTemplateString,
  fromGLColor,
  toGLColor,
} from './utils';
import { quad } from './quad';

type ColorUniform =
  | { type: 'color'; value: Vec3 }
  | { type: 'color'; value: string };

export type GLUniform =
  | { type: 'float'; value: number }
  | { type: 'vec2'; value: Vec2 }
  | { type: 'vec3'; value: Vec3 }
  | { type: 'color'; value: Vec3 };

type GuiConfig<U extends GLUniform> = U & {
  min?: number;
  max?: number;
  step?: number;
};

type ScriptConfig<U extends GLUniform> = U & {
  script?: (value: U) => void;
};

type UniformStore = Record<string, GLUniform>;
export type GLUniforms = Record<string, GLUniform['value']>;

export class Shader {
  gui = new GUI();
  unnamed = 1;
  @observable values: UniformStore = {};
  guiValues = guiUniformProxy(this.values);
  glValues = glUniformProxy(this.values);

  constructor(public regl: REGL.Regl = REGL()) {}

  generateName() {
    return `unnamed_${this.unnamed++}`;
  }

  float = (
    name = this.generateName(),
    value = 0,
    min = 0,
    max = 1,
    step = 0.01,
  ) => this.prop({ name, value, type: 'float', min, max, step });

  color = (name = this.generateName(), value = '#888888') =>
    this.prop({ name, value: toGLColor(value), type: 'color' });

  prop = <U extends GLUniform & { name?: string }>(
    config: U extends ScriptConfig<U>
      ? ScriptConfig<U>
      : U extends GuiConfig<U>
      ? GuiConfig<U>
      : U,
  ): string => {
    const { name = this.generateName(), type, value } = config;
    const uniform = observable({ type, value } as U);
    this.values[name] = uniform;
    if ('script' in config) {
      const { script } = config as ScriptConfig<U>;
      script?.(uniform);
    } else if (type === 'color') {
      this.gui.addColor(this.guiValues, name);
    } else {
      const { min = 0, max = 1, step = 0.01 } = config as GuiConfig<U>;
      this.gui.add(this.guiValues, name, min, max, step);
    }

    return name;
  };

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

  get canvas(): HTMLCanvasElement {
    return this.regl._gl.canvas as HTMLCanvasElement;
  }

  public glsl = (shaderBody: TemplateStringsArray, ...splices: string[]) => {
    const config = reglMerge(quad, {
      frag: `\n${this.header}\n${reduceTemplateString(shaderBody, ...splices)}`,
      uniforms: Object.keys(this.glValues).reduce((u, key) => {
        u[key] = this.regl.prop<GLUniforms, string>(key);
        return u;
      }, {} as any),
    });

    // Log complete shader source
    console.log(config.frag);

    const draw = this.regl(config);

    autorun(() => draw(this.props));
    window.addEventListener('resize', () => {
      this.regl.poll();
      draw(this.props);
    });
  };
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
