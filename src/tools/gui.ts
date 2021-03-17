import { GUI, GUIController } from 'dat.gui';
import { Store } from './stream/store';

/**
 * A normal dat.GUI requires you to create an object and populate it with
 * default values before using it. This AutoGUI will instead manage that
 * for you, changing the `add` APIs to include the default value first.
 *
 * TODO: stronger types
 * TODO: instead of patching, maybe extend GUI and add new "auto" APIs?
 */
export interface AutoGUI extends Omit<GUI, 'add' | 'addColor'> {
  add: {
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
  };
  addColor: {
    (value: string, name: string): GUIController;
  };
}
export class AutoGUI {
  constructor({
    gui = new GUI(),
    store = new Store(),
  }: { gui?: GUI; store?: Record<string, unknown> } = {}) {
    (['add', 'addColor'] as const).forEach(method => {
      const original = gui[method];
      gui[method] = <T>(defaultValue: T, name: string, ...args: any) => {
        store[name] = defaultValue;
        // @ts-expect-error
        return original.call(gui, store, name, ...args);
      };
    });
    return gui as AutoGUI;
  }
}

export function isGUIController(x: any): x is GUIController {
  return 'object' in x && 'property' in x;
}
