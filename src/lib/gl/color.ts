import type REGL from 'regl';

const colorRegex = /^#([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})$/i;

export function toHex(color: number) {
  const hex = Math.round(color * 255).toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

export function fromGLColor([r, g, b]: REGL.Vec3) {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const isColor = (guiColor: any): boolean =>
  typeof guiColor === 'string' && colorRegex.test(guiColor);

export function toGLColor(guiColor: string): REGL.Vec3 {
  const test = guiColor.match(colorRegex);
  if (test === null) {
    throw new Error('cannot read color');
  }
  return [
    parseInt(test[1], 16) / 255,
    parseInt(test[2], 16) / 255,
    parseInt(test[3], 16) / 255,
  ];
}
