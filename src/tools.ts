import type REGL from 'regl';
import createREGL from 'regl';
import { autorun } from 'mobx';
import { quad } from './quad';
import { Uniforms, GLUniforms } from './Uniforms';

function merge<T extends REGL.DrawConfig>(a: T, b: T) {
  return Object.entries(b).reduce(
    (result: any, [key, value]) => {
      result[key] =
        typeof value === 'string'
          ? (result[key] as string) + value
          : { ...result[key], ...value };
      return result;
    },
    { ...a },
  );
}

const regl = createREGL();

export const glsl = (
  fragShader: TemplateStringsArray,
  ...splices: string[]
) => (uniforms: Uniforms) => {
  const body = fragShader.reduce(
    (shader, segment) => `${shader}${splices.shift() ?? ''}${segment}`,
  );

  const config = merge(quad, {
    frag: `
${uniforms.header}
${body}
`,
    uniforms: Object.keys(uniforms.glValues).reduce((u, key) => {
      u[key] = regl.prop<GLUniforms, string>(key);
      return u;
    }, {} as any),
  });

  console.log(config.frag);

  const draw = regl(config);

  autorun(() => draw(uniforms.props));
  window.addEventListener('resize', () => {
    regl._refresh();
    draw(uniforms.props);
  });
};
