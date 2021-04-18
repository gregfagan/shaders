import type REGL from 'regl';
import { glsl } from '../regl';

const vert = `
precision mediump float;
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = 0.5 * (position + 1.0);
  gl_Position = vec4(position, 0, 1);
}
`;

/**
 * A REGL DrawConfig that draws a simple quad to the screen, with an inscribed
 * square coordinate system accesible through included glsl functions.
 */
export const quad = glsl`
${{
  depth: { enable: false },
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
  uniforms: {
    viewport: ({ viewportWidth, viewportHeight }: REGL.DefaultContext) => [
      viewportWidth,
      viewportHeight,
    ],
  },
  scissor: {
    enable: true,
    box: ({ viewportWidth, viewportHeight }) => {
      const min = Math.min(viewportWidth, viewportHeight);
      const margin = Math.max(viewportWidth, viewportHeight) - min;
      const position =
        viewportWidth > viewportHeight
          ? { x: margin / 2, y: 0 }
          : { x: 0, y: margin / 2 };
      const result = { ...position, width: min, height: min };
      return result;
    },
  },
}}

precision mediump float;

uniform vec2 viewport;
varying vec2 uv;

vec2 coord(vec2 p) {
  return 2. * (p - 0.5 * viewport) / min(viewport.x, viewport.y);
}

vec2 st() {
  return coord(gl_FragCoord.xy);
}

float aastep(float edge, float x) {
  float e = 1./max(viewport.x, viewport.y);
  return smoothstep(edge - e, edge + e, x);
}
`;
