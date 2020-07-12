import { GUI } from 'dat.gui';
import { stream, log } from './stream';

interface Store {
  $: Record<string, flyd.Stream<unknown>>;
  [key: string]: unknown;
}

/**
 * Object proxy which internally stores state in streams. access streams
 * through $.
 */
const store: Store = new Proxy<Record<string, flyd.Stream<unknown>>>(
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
  },
) as Store;

/**
    add(target: Object, propName:string, min?: number, max?: number, step?: number): GUIController;
    add(target: Object, propName:string, status: boolean): GUIController;
    add(target: Object, propName:string, items:string[]): GUIController;
    add(target: Object, propName:string, items:number[]): GUIController;
    add(target: Object, propName:string, items:Object): GUIController;
    addColor(target: Object, propName:string): GUIController;
 */

const g = new GUI();
// todo wtf mate stay on top
g.domElement.parentElement?.setAttribute('style', 'z-index: 1');

export function gui<T>(name: string, defaultValue: T): flyd.Stream<T> {
  store[name] = defaultValue;
  g.add(store, name);
  return store.$[name] as flyd.Stream<T>;
}
