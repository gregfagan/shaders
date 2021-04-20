import { stream } from '../lib/stream';
import { pointers } from '../lib/stream/dom';
import { keys } from './util';

const keyboardController = keys.map(
  ({ a, ArrowLeft, d, ArrowRight, w, ArrowUp }) => ({
    left: a || ArrowLeft,
    right: d || ArrowRight,
    thrust: w || ArrowUp,
  })
);

// Within 280px square in bottom left:
//   top left: turn left
//   bottom right: turn right
// Within 280px square in bottom right:
//   thrust
const pointerController = stream.scan(
  (controls, pointer) => {
    const x =
      pointer.x > pointer.container.width / 2
        ? pointer.x - pointer.container.width
        : pointer.x;
    const absX = Math.abs(x);

    const y = pointer.container.height - pointer.y;

    const valid = absX < 280 && y < 280;
    const top = absX - y < 0;
    const control = !valid
      ? 'none'
      : x > 0
      ? top
        ? 'left'
        : 'right'
      : 'thrust';

    if (control !== 'none') {
      return {
        ...controls,
        [control]: pointer.type === 'pointerdown',
      };
    }

    return controls;
  },
  { left: false, right: false, thrust: false },
  pointers(document)
);

export const controller = stream.merge(keyboardController, pointerController);
