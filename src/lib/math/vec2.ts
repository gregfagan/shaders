import { vec2, vec3 } from 'gl-matrix';
import { purifyWith } from './purify';

const purify = purifyWith(vec2.create);

export const of = (x: number, y = x) => vec2.fromValues(x, y);
export const add = purify(vec2.add);
export const subtract = purify(vec2.subtract);
export const multiply = purify(vec2.multiply);
export const divide = purify(vec2.divide);
export const ceil = purify(vec2.ceil);
export const floor = purify(vec2.floor);
export const min = purify(vec2.min);
export const max = purify(vec2.max);
export const round = purify(vec2.round);
export const scale = purify(vec2.scale);
export const scaleAndAdd = purify(vec2.scaleAndAdd);
export const distance = vec2.distance;
export const squaredDistance = vec2.squaredDistance;
export const length = vec2.length;
export const squaredLength = vec2.squaredLength;
export const negate = purify(vec2.negate);
export const inverse = purify(vec2.inverse);
export const normalize = purify(vec2.normalize);
export const dot = vec2.dot;
export const cross = purifyWith(vec3.create)(vec2.cross);
export const lerp = purify(vec2.lerp);
export const random = purify(vec2.random);
export const transformMat2 = purify(vec2.transformMat2);
export const transformMat2d = purify(vec2.transformMat2d);
export const transformMat3 = purify(vec2.transformMat3);
export const transformMat4 = purify(vec2.transformMat4);
export const rotate = purify(vec2.rotate);
export const angle = vec2.angle;
export const zero = purify(vec2.zero);
export const str = vec2.str;
export const exactEquals = vec2.exactEquals;
export const equals = vec2.equals;
export const len = vec2.len;
export const sub = purify(vec2.sub);
export const mul = purify(vec2.mul);
export const div = purify(vec2.div);
export const dist = vec2.dist;
export const sqrDist = vec2.sqrDist;
export const sqrLen = vec2.sqrLen;

export const map = (f: (v: number) => number) => (v: vec2) => v.map(f) as vec2;
export const clampLength = (max: number) => (v: vec2) =>
  len(v) > max ? scale(normalize(v), max) : v;
