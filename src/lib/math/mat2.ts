import { mat2 } from 'gl-matrix';
import { purifyWith } from './purify';

const purify = purifyWith(mat2.create);

export const copy = purify(mat2.copy);
export const transpose = purify(mat2.transpose);
export const invert = purify(mat2.invert);
export const adjoint = purify(mat2.adjoint);
export const determinant = mat2.determinant;
export const multiply = purify(mat2.multiply);
export const rotate = purify(mat2.rotate);
export const scale = purify(mat2.scale);
export const fromRotation = purify(mat2.fromRotation);
export const fromScaling = purify(mat2.fromScaling);
export const str = mat2.str;
export const frob = mat2.frob;
export const LDU = mat2.LDU;
export const add = purify(mat2.add);
export const subtract = purify(mat2.subtract);
export const exactEquals = mat2.exactEquals;
export const equals = mat2.equals;
export const multiplyScalar = purify(mat2.multiplyScalar);
export const multiplyScalarAndAdd = purify(mat2.multiplyScalarAndAdd);
export const mul = purify(mat2.mul);
export const sub = purify(mat2.sub);
