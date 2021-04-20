import { equals, prop } from 'ramda';
import { Vec2 } from 'regl';
import { event, Stream, stream } from '.';

export const documentHasFocus = stream.merge(
  stream(document.hasFocus()),
  stream
    .merge(event(window, 'focus'), event(window, 'blur'))
    .map(prop('type'))
    .map(equals('focus'))
);

export type KeyMap = Record<KeyboardEvent['key'], boolean>;
export const keyboard = (el: EventTarget): Stream<KeyMap> =>
  stream.scan(
    (current, next: KeyboardEvent) => {
      next.preventDefault();
      next.stopPropagation();
      current[next.key] = next.type === 'keydown';
      return current;
    },
    {} as KeyMap,
    stream.merge(
      event<KeyboardEvent>(el, 'keydown'),
      event<KeyboardEvent>(el, 'keyup')
    )
  );

interface MouseMoveElement extends EventTarget {
  width: number;
  height: number;
}

export const mousePosition = (el: MouseMoveElement) =>
  stream.merge(
    stream.of<Vec2>([el.width / 2, el.height / 2]),
    event<MouseEvent>(el, 'mousemove').map(glCoordinatesFromMouseEvent)
  );

const glCoordinatesFromMouseEvent = (e: MouseEvent): Vec2 => [
  e.clientX * window.devicePixelRatio,
  ((e.target as HTMLElement).clientHeight - e.clientY) *
    window.devicePixelRatio,
];

export const pointers = (el: EventTarget) =>
  stream
    .merge(
      event<PointerEvent>(el, 'pointerdown'),
      event<PointerEvent>(el, 'pointerup')
    )
    .map(e => {
      e.preventDefault();
      e.stopPropagation();
      return {
        id: e.pointerId,
        type: e.type,
        x: e.clientX,
        y: e.clientY,
        container: isElement(e.target)
          ? e.target.getBoundingClientRect()
          : new DOMRect(),
      };
    });

const isElement = (e: any): e is Element => e instanceof Element;
