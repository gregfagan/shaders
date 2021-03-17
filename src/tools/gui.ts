import { GUI, GUIController, controllers } from 'dat.gui';
import { stream, log } from './stream';

interface Store {
  $: Record<string, flyd.Stream<unknown>>;
  [key: string]: unknown;
}

/**
 * Object proxy which internally stores state in streams. access streams
 * through $.
 */
export const streamProxy: () => Store = () =>
  new Proxy<Record<string, flyd.Stream<unknown>>>(
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

/**
    add(target: Object, propName:string, min?: number, max?: number, step?: number): GUIController;
    add(target: Object, propName:string, status: boolean): GUIController;
    add(target: Object, propName:string, items:string[]): GUIController;
    add(target: Object, propName:string, items:number[]): GUIController;
    add(target: Object, propName:string, items:Object): GUIController;
    addColor(target: Object, propName:string): GUIController;
 */

export interface GUIAutoAdd {
  <T>(
    value: T,
    name: string,
    min?: number,
    max?: number,
    step?: number
  ): GUIController;
  <T>(value: T, name: string, status: boolean): GUIController;
  <T>(value: T, name: string, items: string[]): GUIController;
  <T>(value: T, name: string, items: number[]): GUIController;
  <T>(value: T, name: string, items: Object[]): GUIController;
}

export interface GUIAutoAddColor {
  (value: string, name: string): GUIController;
}

export type AutoGUI = Omit<GUI, 'add' | 'addColor'> & {
  add: GUIAutoAdd;
  addColor: GUIAutoAddColor;
};

export type AddGuiArgs =
  | []
  | [number]
  | [number, number]
  | [number, number, number]
  | [boolean]
  | [string[]]
  | [number[]]
  | [Object];

// const g = new GUI();
// g.domElement.parentElement?.setAttribute('style', 'z-index: 1');
// const store = streamProxy();
// // export function gui<T>(name: string, defaultValue: T): flyd.Stream<T>;
// export function gui<T>(
//   name: string,
//   defaultValue: T,
//   ...args: AddGuiArgs
// ): flyd.Stream<T> {
//   store[name] = defaultValue;
//   // @ts-expect-error
//   g.add(store, name, ...args);
//   return store.$[name] as flyd.Stream<T>;
// }

/**
 * A stream of changed gui values
 */
export function guiChanged() {
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

export function isGUIController(x: unknown): x is GUIController {
  return x instanceof controllers.Controller;
}
