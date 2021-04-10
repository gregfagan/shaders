import REGL from 'regl';
import { stream } from './tools/stream';
import { glsl, uniform } from './tools/gl/regl';
import { quad } from './tools/gl/config/quad';
import { sdf } from './tools/gl/config/sdf';
import { asteroidsConfig } from './game/asteroid';
import { clock, gui, screenWrap } from './game/util';
import { playerConfig } from './game/player';

const regl = REGL();

const draw = glsl`
${quad}
${sdf}
${playerConfig}
${asteroidsConfig}

float sdSpace(vec2 p) {
  float d = INFINITY;
  d = opUnion(d, sdPlayer(p));
  d = opUnion(d, sdAsteroids(p));
  return d;
}

void main() {
  vec2 p = st();
  float d = INFINITY;

  ${screenWrap(glsl`
    d = opUnion(d, sdPlayer(p - pScreenWrap));
  `)}

  vec3 sdVis = sdColor(d);
  d = step(0., d);

  vec3 color = vec3(0.);
  
  vec4 aColor = asteroidsColor(p);
  color = mix(color, aColor.xyz, aColor.w);

  color = mix(color, vec3(1.), 1. - d);
  color = mix(color, sdVis, ${uniform(gui.auto(0, 'u_vis', 0, 1))});
  

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
