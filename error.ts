export const nil = Symbol("nil");
export type MaybeNil<T extends [unknown, unknown]> = [
  T[0] | null,
  T[1] | typeof nil,
];
