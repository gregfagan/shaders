import {
  observable,
  computed,
  IReactionDisposer,
  reaction,
  configure,
  toJS,
  action,
} from 'mobx';
import { deepObserve } from 'mobx-utils';
import { GUI } from 'dat.gui';
import REGL, { Vec3, Vec2 } from 'regl';
import {
  reglMerge,
  reduceTemplateString,
  fromGLColor,
  toGLColor,
} from './utils';
import { quad } from './quad';

export type GLUniform =
  | { type: 'bool'; value: boolean }
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
  script?: (
    value: U,
    onFrame: (callback: FrameRequestCallback) => void,
  ) => void;
};

type UniformStore = Record<string, GLUniform>;
export type GLUniforms = Record<string, GLUniform['value']>;

configure({
  computedRequiresReaction: true,
});

export class Shader {
  // GUI
  gui = new GUI();
  @observable ui: Record<string, any> = {};

  // Uniforms
  unnamed = 1;
  @observable values: UniformStore = {};
  guiValues = guiUniformProxy(this.values);
  glValues = glUniformProxy(this.values);

  // Renderer
  @observable private frameId = 0;
  @observable private updateRequested = false;
  @observable source = '';

  constructor(public regl: REGL.Regl = REGL()) {
    this.saveGuiValues();
    this.setupRender();

    const update = action((elapsed: number) => {
      // Reset update state before calling callbacks which might
      // request future updates.
      this.updateRequested = false;
      for (const onFrame of this.frameCallbacks) {
        onFrame(elapsed);
      }
      this.frameId++;
    });

    const requestUpdate = () => {
      if (this.updateRequested) return;
      requestAnimationFrame(update);
      this.updateRequested = true;
    };

    // Setting any state requests an update
    deepObserve(this.values, requestUpdate);
  }

  setupRender() {
    let disposeRender: IReactionDisposer;
    let resizeHandler: EventListener;
    reaction(
      () => this.draw,
      (draw) => {
        console.log('setting up rendering');
        if (disposeRender) disposeRender();
        if (resizeHandler) window.removeEventListener('resize', resizeHandler);
        if (!draw) return;

        disposeRender = reaction(
          () => this.frameId,
          (frameId) => {
            // console.log('render', frameId);
            draw();
          },
          { name: 'render' },
        );
        resizeHandler = () => {
          this.regl.poll();
          draw();
        };
        window.addEventListener('resize', resizeHandler);
      },
    );
  }

  generateName() {
    return `unnamed_${this.unnamed++}`;
  }

  addGui = (name: string, value: any) => {
    this.ui[name] = value;
    this.gui.add(this.ui, name);
  };

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
      script?.(uniform, this.onFrame);
    } else if (type === 'color') {
      this.gui.addColor(this.guiValues, name);
    } else {
      const { min = 0, max = 1, step = 0.01 } = config as GuiConfig<U>;
      this.gui.add(this.guiValues, name, min, max, step);
    }

    return name;
  };

  frameCallbacks: FrameRequestCallback[] = [];
  onFrame = (callback: FrameRequestCallback) => {
    this.frameCallbacks.push(callback);
  };

  @computed get header() {
    return Object.entries(this.glValues).reduce((header, [name, uniform]) => {
      const declaration = `uniform ${uniform.type} ${name};`;
      return `${header}\n${declaration}`;
    }, '');
  }

  get canvas(): HTMLCanvasElement {
    return this.regl._gl.canvas as HTMLCanvasElement;
  }

  @computed({ keepAlive: true }) get draw() {
    if (this.source === '') return null;
    const config = reglMerge(quad, {
      frag: `\n${this.header}\n${this.source}`,
      uniforms: Object.keys(this.glValues).reduce((u, key) => {
        u[key] = () => this.glValues[key].value; //this.regl.prop<GLUniforms, string>(key);
        return u;
      }, {} as any),
    });

    // Log complete shader source
    // console.log(config.frag);

    return this.regl(config);
  }

  saveGuiValues() {
    this.gui.useLocalStorage = true;
    setTimeout(() => {
      this.gui.domElement
        .querySelector<HTMLElement>('.save-row')!
        .setAttribute('style', 'display: none');
    }, 0);
    this.gui.remember(this.guiValues, this.ui);
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

export const glsl = (template: TemplateStringsArray, ...splices: string[]) =>
  reduceTemplateString(template, ...splices);
