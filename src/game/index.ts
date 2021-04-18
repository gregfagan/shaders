import { quad } from '../lib/gl/config/quad';
import { sdf } from '../lib/gl/config/sdf';
import { glsl } from '../lib/gl/regl';
import * as player from './player';
import { asteroidsConfig } from './asteroid';

export const draw = glsl`
${quad}
${sdf}
${player.draw}
${asteroidsConfig}

void main() {
  vec2 p = st();
  vec3 color = vec3(0.);
  
  vec4 aColor = asteroidsColor(p);
  color = mix(color, aColor.xyz, aColor.w);
  vec4 pColor = playerColor(p);
  color = mix(color, pColor.xyz, pColor.w);

  gl_FragColor = vec4(color, 1.);
}
`;
