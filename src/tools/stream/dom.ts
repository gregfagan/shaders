import { equals, prop } from 'ramda';
import { Vec2 } from 'regl';
import { event, stream } from '.';

export const documentHasFocus = stream.merge(
  stream(document.hasFocus()),
  stream
    .merge(event(window, 'focus'), event(window, 'blur'))
    .map(prop('type'))
    .map(equals('focus'))
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
