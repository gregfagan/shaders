import REGL from 'regl';
import { quad } from './config/quad';
import { glsl } from './regl';

import { setControllerVisible } from '../gui';
import { AutoGUI } from '../gui';
import { stream } from '../stream';

export const createRenderScale = (
  regl: REGL.Regl,
  parentGui: AutoGUI,
  config: REGL.DrawConfig
) => {
  const gui = parentGui.addFolder('render scale');

  const mode = gui.auto<REGL.TextureMagFilterType | 'none'>('nearest', 'mode', [
    'none',
    'linear',
    'nearest',
  ]);
  const textureSize = gui.auto(8, 'textureSize', 3, 11, 1);
  const renderer = stream.combine(
    (mode, size) => {
      const currentMode = mode();
      if (currentMode === 'none') {
        console.dir(textureSize.controller);
        setControllerVisible(textureSize.controller, false);
        return regl(config);
      }
      setControllerVisible(textureSize.controller, true);
      return renderScale(config, 2 ** size(), currentMode)(regl).render;
    },
    [mode, textureSize]
  );

  return renderer;
};

export const renderScale = (
  config: REGL.DrawConfig,
  textureSize: number,
  filter: REGL.TextureMagFilterType = 'nearest'
) => (regl: REGL.Regl) => {
  const tex = regl.texture({
    min: 'linear',
    mag: filter,
    radius: textureSize,
    wrap: 'repeat',
  });

  const fbo = regl.framebuffer({
    depth: false,
    color: tex,
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

  return {
    renderToTexture,
    renderToScreen,
    texture: fbo,
    render: () => {
      renderToTexture();
      renderToScreen();
    },
  };
};
