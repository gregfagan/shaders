import REGL from 'regl';
import Stats from 'stats.js';
import { stream } from './lib/stream';
import { clock } from './game/util';
import { draw as game } from './game';
import { pixellate } from './lib/gl/pixellate';

const regl = REGL();
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const render = pixellate(game, 256)(regl);

stream.on(() => {
  regl.poll();
  render();
  stats.update();
}, clock);
