const SEP_TAG = "<!-- SEP-1511151742953336 -->";

export function readHTML(path: string): string {
  const decoder = new TextDecoder("utf-8");
  const data = Deno.readFileSync(path);
  return decoder.decode(data);
}

export function commitChanges(commitMsg: string): void {
  const commands = [
    ["git", "pull origin master"],
    ["git", "add ."],
    ["git", `commit -m '${commitMsg}'`],
    ["git", "push origin master"],
  ];
  for (const cmd of commands) {
    Deno.run({
      cmd,
    });
  }
}

export function appendToHTML(original: string, newHtml: string): string {
  const [head, tail] = original.split(SEP_TAG);
  const modifiedHtml = [head, newHtml + tail].join(SEP_TAG + "\n");
  return modifiedHtml;
}

export function writeHTML(html: string): void {
  const encoder = new TextEncoder();
  const data = encoder.encode(html);
  Deno.writeFileSync("index.html", data);
}
