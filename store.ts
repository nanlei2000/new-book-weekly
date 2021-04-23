import { dirname, fromFileUrl, log } from "./dep.ts";
export const SEP_TAG = "<!-- SEP-1511151742953336 -->";
const moduleDir = dirname(fromFileUrl(import.meta.url));

export async function commitChanges(commitMsg: string): Promise<void> {
  const commands = [
    ["git", "pull", "origin", "master"],
    ["git", "add", "."],
    ["git", "commit", "-m", commitMsg],
    ["git", "push", "origin", "master"],
  ];
  const decoder = new TextDecoder("utf-8");
  for (const cmd of commands) {
    const p = Deno.run({
      cmd,
      cwd: moduleDir,
      stdout: "piped",
    });
    const output = await p.output();
    const text = decoder.decode(output);
    log.info(text);
    p.close();
  }
}

export function appendToHTML(original: string, newHtml: string): string {
  const [head, tail] = original.split(SEP_TAG);
  const modifiedHtml = [head, newHtml + tail].join(SEP_TAG + "\n");
  return modifiedHtml;
}
