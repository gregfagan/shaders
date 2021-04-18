import REGL from 'regl';
import Stats from 'stats.js';
import { stream } from './lib/stream';
import { clock, gui } from './game/util';
import { draw as game } from './game';
import { createRenderScale } from './lib/gl/renderScale';

const regl = REGL();
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const renderer = createRenderScale(regl, gui, game);

stream.on(() => {
  regl.poll();

  renderer()();

  stats.update();
}, clock);
