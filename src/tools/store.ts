import { stream, Stream } from './stream';

export interface Store {
  $: Record<string, Stream<unknown>>;
  [key: string]: unknown;
}

/**
 * Object proxy which internally stores state in streams. access streams
 * through $.
 */
export class Store {
  constructor() {
    return new Proxy<Record<string, Stream<unknown>>>(
      {},
      {
        get(target, key: string) {
          return key === '$' ? target : target[key]?.() ?? undefined;
        },
        set(target, key: string, value) {
          const $ = target[key];
          if ($) {
            $(value);
          } else {
            target[key] = stream(value);
          }
          return true;
        },
      }
    ) as Store;
  }
}

export function changed(store: Store): Stream<unknown> {
  const streams = Object.values(store.$);
  return stream.combine<unknown, unknown>(
    (...all) => {
      const [self, changed] = all.splice(streams.length);
      self(changed);
    },
    // @ts-expect-error
    streams
  );
}
