export import Stream = flyd.Stream;
export type StreamAPI = Omit<flyd.Static, 'combine'> & {
  combine: Combine;
} & flyd.CreateStream & { of: flyd.CreateStream };

export type StreamData<S> = S extends Stream<infer T> ? T : never;

interface Combine {
  <T, R>(
    fn: (value: Stream<T>, self: Stream<R>) => R | void,
    streams: [Stream<T>]
  ): Stream<R>;
  <T, T1, R>(
    fn: (
      value: Stream<T>,
      t1: Stream<T1>,
      self: Stream<R>,
      changed: Array<Stream<T> | Stream<T1>>
    ) => R | void,
    streams: [Stream<T>, Stream<T1>]
  ): Stream<R>;
  <T, T1, T2, R>(
    fn: (
      value: Stream<T>,
      t1: Stream<T1>,
      t2: Stream<T2>,
      self: Stream<R>,
      changed: Stream<T | T1 | T2>[]
    ) => R | void,
    streams: [Stream<T>, Stream<T1>, Stream<T2>]
  ): Stream<R>;

  <T, T1, T2, T3, R>(
    fn: (
      value: Stream<T>,
      t1: Stream<T1>,
      t2: Stream<T2>,
      t3: Stream<T3>,
      self: Stream<R>,
      changed: Stream<T | T1 | T2 | T3>[]
    ) => R | void,
    streams: [Stream<T>, Stream<T1>, Stream<T2>, Stream<T3>]
  ): Stream<R>;
}
