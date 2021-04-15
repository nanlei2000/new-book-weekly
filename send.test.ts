import { assert, equal } from "https://deno.land/std@0.93.0/testing/asserts.ts";
import { Config, readConfig, sendMail } from "./send.ts";
import { fetchHTML, getNewBookList } from "./get.ts";
import { nil } from "./error.ts";

Deno.test("readConfig", () => {
  const [res, err] = readConfig("tests/.env.test.json");
  assert(err === nil);
  equal(res, {
    "auth": {
      "user": "user",
      "pass": "pass",
    },
    "to": "to",
    "commitToGit": false,
  });
});

Deno.test({
  name: "sendMailFull",
  ignore: true,
  fn: async () => {
    const [res, err] = readConfig(".env.json");
    assert(err === nil);
    await sendMail(res as Config, "<a href='https://github.com'>Github</a>");
  },
});

Deno.test({
  name: "sendMailFull",
  ignore: true,
  fn: async () => {
    const [res, err] = readConfig(".env.json");
    assert(err === nil);
    const raw = (await fetchHTML(1))!;
    const html = getNewBookList(raw);
    await sendMail(res!, html[0]);
  },
});
