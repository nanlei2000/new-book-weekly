import { appendToHTML, commitChanges, SEP_TAG } from "./store.ts";

Deno.test({
  name: "commitChanges",
  ignore: !true,
  fn: async () => {
    await commitChanges("add test");
  },
});

Deno.test({
  name: "appendToHTML",
  ignore: !true,
  fn: () => {
    const html = "1" + SEP_TAG + "2";
    appendToHTML(html, "3");
  },
});
