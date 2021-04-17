import type REGL from 'regl';
import { glsl } from '../regl';

const vert = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0, 1);
}
`;

/**
 * A REGL DrawConfig that draws a simple quad to the screen, with an inscribed
 * square coordinate system accesible through included glsl functions.
 */
export const quad = glsl`
${{
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
}}

precision mediump float;

uniform vec2 viewport;

vec2 coord(vec2 p) {
  return 2. * (p - 0.5 * viewport) / min(viewport.x, viewport.y);
}

vec2 st() {
  return coord(gl_FragCoord.xy);
}

float aastep(float edge, float x) {
  vec2 screen = 1./viewport * 2.;
  float e = max(screen.x, screen.y);
  return smoothstep(edge - e, edge + e, x);
}
`;
