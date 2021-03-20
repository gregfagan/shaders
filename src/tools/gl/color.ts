import type REGL from 'regl';

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
