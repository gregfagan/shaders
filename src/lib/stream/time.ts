import { add } from 'ramda';
import { stream, switchLatest, everyNth, Stream } from '.';

/**
 * Wall time updated by animation frame (60Hz)
 */
export function clock() {
  const id = stream<number>();
  const time = stream<number>();
  const clock = stream.merge(
    stream.of(0),
    stream.immediate(
      stream.combine(
        time => {
          id(requestAnimationFrame(time));
          return time();
        },
        [time]
      )
    )
  );
  stream.on(() => cancelAnimationFrame(id()), clock.end);
  return clock;
}

/**
 * Accumulates time while the `stopped` stream is false
 *
 * @param stopped a stream to start and stop the stopwatch
 */
export function stopwatch(stopped: Stream<boolean>) {
  const clocks = stream.combine<boolean, Stream<number>>(
    (stopped, self) => {
      if (stopped()) {
        if (self()) {
          // If we're running a clock, stop it
          self().end(true);
        }
      } else {
        // Create a new clock and track time deltas
        return clock().pipe(delta);
      }
    },
    [stopped]
  );
  const deltaTime = switchLatest(clocks);
  return stream.scan(add, 0, deltaTime);
}

/**
 * A stream of the delta between values from the input stream
 */
export function delta(s: Stream<number>) {
  let last: number;
  return stream.combine<number, number>(
    (current, self) => {
      if (last !== undefined) {
        self(current() - last);
        last = current();
      } else {
        last = current();
      }
    },
    [s]
  );
}

export const seconds = everyNth(60);
