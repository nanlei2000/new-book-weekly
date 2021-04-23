import { readFile, writeFile } from "./utils.ts";
import { equal } from "./dep.ts";

Deno.test({
  name: "writeFile",
  fn: () => {
    const path = "./tests/test.out";
    writeFile("hello", path);
    const content = readFile(path);
    equal(content, "hello");
    Deno.removeSync(path, { recursive: true });
  },
});
