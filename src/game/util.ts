import { stopwatch, delta } from '../lib/stream/time';
import { documentHasFocus, keyboard } from '../lib/stream/dom';
import { not } from 'ramda';
import { log } from '../lib/stream';
import { AutoGUI } from '../lib/gui';
import { DrawConfig } from 'regl';

export const gui = new AutoGUI();
gui.domElement.parentElement!.style.zIndex = Number.MAX_SAFE_INTEGER.toString();

// set up a clock which stops without focus
const pause = documentHasFocus.map(not).map(log('pause'));
export const clock = stopwatch(pause);
export const dt = delta(clock).map(dt => dt / 1000);

// track input
export const keys = keyboard(document);

export const wrap = (value: number) =>
  value < -1 ? value + 2 : value > 1 ? value - 2 : value;

export const screenWrap = ({ frag }: DrawConfig) => `
  for (float x = -2.; x <= 2.; x += 2.) {
    for (float y = -2.; y <= 2.; y += 2.) {
      vec2 pScreenWrap = vec2(x, y);
      ${frag as string}
    }
  }
`;
