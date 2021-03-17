import R from "ramda";
import flyd from "flyd";

type StreamAPI = flyd.Static & flyd.CreateStream & { of: flyd.CreateStream };

/**
 * Better flyd API by combining CreateStream with static, like mithril
 */
export const stream = flyd.stream.bind({}) as StreamAPI;
Object.assign(stream, { ...flyd, of: stream });

export const log = <T>(...args: any[]) =>
  R.tap<T>(R.partial<any>(console.log, args));

export const sample = <T>(what: flyd.Stream<T>, when: flyd.Stream<any>) =>
  stream.combine(() => what(), [when]);

export function event<T = Event>(
  target: EventTarget,
  name: string
): flyd.Stream<T> {
  const s = stream.of<T>();
  target.addEventListener(name, s);
  return s;
}

export function switchLatest<T>(s: flyd.Stream<flyd.Stream<T>>) {
  return stream.combine<flyd.Stream<T>, T>(
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
      .scan(R.add(1), 0, s)
      .map(R.pipe(R.modulo(R.__, n), R.equals(0)))
      .pipe(whenTruthy)
  );
};
