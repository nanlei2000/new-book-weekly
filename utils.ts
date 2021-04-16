export const nil = Symbol("nil");
export type MaybeNil<T extends [unknown, unknown]> = [
  T[0] | null,
  T[1] | typeof nil,
];

export function readFile(path: string): string {
  const decoder = new TextDecoder("utf-8");
  const data = Deno.readFileSync(path);
  return decoder.decode(data);
}
