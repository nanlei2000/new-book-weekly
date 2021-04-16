import { commitChanges } from "./store.ts";
Deno.test({
  name: "commitChanges",
  ignore: !true,
  fn: async () => {
    await commitChanges("test");
  },
});
