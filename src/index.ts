import REGL from 'regl';
import { stream } from './lib/stream';
import { glsl } from './lib/gl/regl';
import { quad } from './lib/gl/config/quad';
import { sdf } from './lib/gl/config/sdf';
import { asteroidsConfig } from './game/asteroid';
import { clock, screenWrap } from './game/util';
import { playerConfig } from './game/player';

const regl = REGL();

const draw = glsl`
${quad}
${sdf}
${playerConfig}
${asteroidsConfig}

void main() {
  vec2 p = st();
  vec3 color = vec3(0.);
  
  vec4 aColor = asteroidsColor(p);
  color = mix(color, aColor.xyz, aColor.w);
  
  float d = INFINITY;
  ${screenWrap(glsl`
    d = opUnion(d, sdPlayer(p - pScreenWrap));
  `)}
  d = step(0., d);
  color = mix(color, vec3(1.), 1. - d);

  // Draw grey borders outside of the inscribed square
  color = mix(vec3(0.1), color, 
    min(
      step(abs(st().x), 1.),
      step(abs(st().y), 1.)
    )
  );

  gl_FragColor = vec4(color, 1.);
}
`;

const render = regl(draw);
stream.on(() => render(), clock);
