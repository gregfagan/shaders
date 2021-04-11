import { GUI, GUIController } from 'dat.gui';
import { isColor } from './gl/color';
import { Stream } from './stream';
import { Store } from './stream/store';

interface GUIStream<T> extends Stream<T> {
  controller: GUIController;
}

/**
 * A normal dat.GUI requires you to create an object and populate it with
 * default values before using it. This AutoGUI will instead manage that
 * for you, with the "auto" API.
 *
 * TODO: stronger types
 */
export class AutoGUI extends GUI {
  constructor(public store: Record<string, unknown> = new Store()) {
    super();
  }

  auto<T>(
    value: T,
    name: string,
    min?: number,
    max?: number,
    step?: number
  ): GUIStream<T>;
  auto<T>(value: T, name: string, status: boolean): GUIStream<T>;
  auto<T>(value: T, name: string, items: string[]): GUIStream<T>;
  auto<T>(value: T, name: string, items: number[]): GUIStream<T>;
  auto<T>(value: T, name: string, items: Object[]): GUIStream<T>;
  auto<T>(defaultValue: T, name: string, ...args: unknown[]): GUIStream<T> {
    const streams = this.store.$ as Record<string, Stream<unknown>>;
    if (streams[name]) return streams[name] as GUIStream<T>;
    this.store[name] = defaultValue;
    const stream = streams[name] as GUIStream<T>;
    stream.controller = isColor(defaultValue)
      ? this.addColor(this.store, name)
      : this.add(this.store, name, ...(args as any));
    return stream;
  }

  addFolder(name: string): AutoGUI {
    const gui = super.addFolder(name) as AutoGUI;
    Object.setPrototypeOf(gui, AutoGUI.prototype);
    gui.store = new Store();
    return gui;
  }
}

export function hasGUIController(x: any): x is { controller: GUIController } {
  return 'controller' in x;
}
