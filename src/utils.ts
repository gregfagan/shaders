import type REGL from 'regl';

export function reglMerge<T extends REGL.DrawConfig>(a: T, b: T) {
  return Object.entries(b).reduce(
    (result: any, [key, value]) => {
      result[key] =
        typeof value === 'string'
          ? ((result[key] as string) ?? '') + '\n' + value
          : { ...result[key], ...value };
      return result;
    },
    { ...a },
  );
}

export function reduceTemplateString(
  template: TemplateStringsArray,
  ...splices: string[]
) {
  return template.reduce(
    (result, segment) => `${result}${splices.shift() ?? ''}${segment}`,
  );
}

export function toHex(color: number) {
  const hex = Math.round(color * 255).toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

export function fromGLColor([r, g, b]: REGL.Vec3) {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function toGLColor(guiColor: string): REGL.Vec3 {
  const test = guiColor.match(/^#([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})$/i);
  if (test === null) {
    throw new Error('cannot read color');
  }
  return [
    parseInt(test[1], 16) / 255,
    parseInt(test[2], 16) / 255,
    parseInt(test[3], 16) / 255,
  ];
}

export const glCoordinatesFromMouseEvent = (e: MouseEvent): REGL.Vec2 => [
  e.clientX * window.devicePixelRatio,
  ((e.target as HTMLElement).clientHeight - e.clientY) *
    window.devicePixelRatio,
];
