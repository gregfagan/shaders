import { observable, autorun } from './mobx.es6.js';

const regl = createREGL();
const gui = new dat.GUI();

const shaderName = (name) => `u_${name}`;
const fromColor = (ctrl) => () => [
  ctrl.__color.r / 255,
  ctrl.__color.g / 255,
  ctrl.__color.b / 255,
];

export const u = observable.object({
  unnamed: 1,
  store: {},
  types: {},

  c(name = `unnamed_${this.unnamed++}`, defaultValue = '#888888') {
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
  const frag = `
precision mediump float;

uniform vec2 viewport;

vec2 coord(vec2 p) {
  return 2. * (p - 0.5 * viewport) / min(viewport.x, viewport.y);
}
${u.header}
${body}
`;
  console.log(frag);
  const draw = regl({
    primitive: 'triangle strip',
    count: 4,
    attributes: {
      position: [
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ],
    },
    vert,
    frag,
    uniforms: {
      viewport: ({ viewportWidth, viewportHeight }) => [
        viewportWidth,
        viewportHeight,
      ],
      ...u.uniformKeys.reduce((uniforms, key) => {
        uniforms[key] = regl.prop(key);
        return uniforms;
      }, {}),
    },
  });

  const render = (props) => {
    // regl.frame(function () {
    // regl.clear({ color: [0, 0, 0, 1] });
    draw(props);
    // });
  };

  autorun(() => render(u.uniforms));
  window.addEventListener('resize', () => {
    regl._refresh();
    render(u.uniforms);
  });

  return render;
};

const vert = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0, 1);
}
`;
