import REGL from 'regl';
import Stats from 'stats.js';
import { stream } from './lib/stream';
import { clock, gui } from './game/util';
import { draw as game } from './game';
import { pixellate } from './lib/gl/pixellate';

const regl = REGL();
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const shouldPixellate = gui.auto(true, 'pixellate');

const render = regl(game);
const renderPixellated = pixellate(game, 256)(regl);

stream.on(() => {
  regl.poll();

  if (shouldPixellate()) {
    renderPixellated();
  } else {
    render();
  }

  stats.update();
}, clock);
