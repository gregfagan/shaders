import { observable, autorun } from './mobx.es6.js';
import { quad } from './quad.js';

function merge(a, b) {
  return Object.entries(b).reduce(
    (result, [key, value]) => {
      result[key] =
        typeof value === 'string'
          ? result[key] + value
          : { ...result[key], ...value };
      return result;
    },
    { ...a },
  );
}

const regl = createREGL();
const gui = new dat.GUI();
// const { createProgram } = regl._gl;
// regl._gl.createProgram = function () {
//   console.log('createprogram');
//   return createProgram.apply(this);
// };
// console.dir(regl._gl.createProgram);

const shaderName = (name) => `u_${name}`;
const fromColor = (ctrl) => () => [
  ctrl.__color.r / 255,
  ctrl.__color.g / 255,
  ctrl.__color.b / 255,
];

// uniforms utility
export const u = observable.object({
  unnamed: 1,
  store: {},
  types: {},

  generateName() {
    return `unnamed_${this.unnamed++}`;
  },

  // float
  f(
    name = this.generateName(),
    defaultValue = 0,
    min = 0,
    max = 1,
    step = 0.01,
  ) {
    const sname = shaderName(name);
    this.store[sname] = defaultValue;
    this.types[sname] = 'float';
    gui.add(this.store, sname, min, max, step);
    return sname;
  },

  // color
  c(name = this.generateName(), defaultValue = '#888888') {
    const sname = shaderName(name);
    this.store[sname] = defaultValue;
    this.types[sname] = fromColor(gui.addColor(this.store, sname));
    return sname;
  },

  get header() {
    return Object.keys(this.store).reduce(
      (header, key) =>
        `${header}\nuniform ${
          typeof this.types[key] === 'function' ? 'vec3' : this.types[key]
        } ${key};`,
      '',
    );
  },

  get uniforms() {
    return Object.entries(this.store).reduce((uniforms, [key, value]) => {
      uniforms[key] =
        typeof this.types[key] === 'function' ? this.types[key]() : value;
      return uniforms;
    }, {});
  },

  get uniformKeys() {
    return Object.keys(this.uniforms);
  },
});

export const glsl = (fragShader, ...splices) => {
  const body = fragShader.reduce(
    (shader, segment) => `${shader}${splices.shift() ?? ''}${segment}`,
  );

  const config = merge(quad, {
    frag: `
${u.header}
${body}
`,
    uniforms: u.uniformKeys.reduce((uniforms, key) => {
      uniforms[key] = regl.prop(key);
      return uniforms;
    }, {}),
  });

  console.log(config.frag);

  const draw = regl(config);

  autorun(() => draw(u.uniforms));
  window.addEventListener('resize', () => {
    regl._refresh();
    draw(u.uniforms);
  });
};
