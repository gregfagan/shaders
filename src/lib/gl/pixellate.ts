import REGL from 'regl';
import { quad } from './config/quad';
import { glsl } from './regl';

export const pixellate = (config: REGL.DrawConfig, textureSize: number) => (
  regl: REGL.Regl
) => {
  const fbo = regl.framebuffer({
    color: regl.texture({
      min: 'linear',
      mag: 'nearest',
      width: textureSize,
      height: textureSize,
      wrap: 'repeat',
    }),
  });

  const renderToTexture = regl({ framebuffer: fbo, ...config });
  const renderToScreen = regl(glsl`
    ${quad}
    ${{ uniforms: { source: fbo } }}
    uniform sampler2D source;
    void main() {
      gl_FragColor = vec4(texture2D(source, st() / 2. + 0.5).xyz, 1.);
    }
  `);

  return () => {
    renderToTexture();
    renderToScreen();
  };
};
