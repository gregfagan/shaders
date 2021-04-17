/**
 * Takes a gl-matrix factory function and returns a function which
 * will make one of that module's impure functions pure by automatically
 * creating a new object for the output with the factory. Example:
 *
 * @example
 * ```typescript
 * // before: (out: vec2, a: vec2: b: vec2) => vec2
 * const add = vec2.add;
 * // after: (a: vec2: b: vec2) => vec2
 * const add = purifyWith(vec2.create)(vec2.add);
 * ```
 */
export const purifyWith = <T>(factory: () => T) => <Q extends any[]>(
  a: (out: T, ...rest: [...Q]) => T
) => (...rest: Q) => a(factory(), ...rest);
