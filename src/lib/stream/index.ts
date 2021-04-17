import flyd from 'flyd';
import { add, equals, modulo, partial, pipe, tap, __ } from 'ramda';
import type { Stream, StreamAPI } from './types';
export * from './types';

/**
 * Better flyd API by combining CreateStream with static, like mithril
 */
export const stream = flyd.stream.bind({}) as StreamAPI;
Object.assign(stream, { ...flyd, of: stream });

export const log = <T>(...args: any[]) =>
  tap<T>(partial<any>(console.log, args));

export const sample = <T>(what: Stream<T>, when: Stream<any>) =>
  stream.combine(() => what(), [when]);

export function event<T = Event>(target: EventTarget, name: string): Stream<T> {
  const s = stream.of<T>();
  target.addEventListener(name, s);
  return s;
}

export function switchLatest<T>(s: Stream<Stream<T>>) {
  return stream.combine<Stream<T>, T>(
    (stream$, self) => {
      stream$().map(self);
    },
    [s]
  );
}

export function whenTruthy<T>(s: flyd.Stream<T>) {
  return stream.combine<T, T>(
    (s, self) => {
      if (s()) self(s());
    },
    [s]
  );
}

export const everyNth = (n: number) => <T>(
  s: flyd.Stream<T>
): flyd.Stream<T> => {
  return sample(
    s,
    stream
      .scan(add(1), 0, s)
      .map(pipe(modulo(__, n), equals(0)))
      .pipe(whenTruthy)
  );
};
