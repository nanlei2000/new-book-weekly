import { assert } from "https://deno.land/std@0.93.0/testing/asserts.ts";
import { fetchHTML, getNewBookList } from "./get.ts";

Deno.test("fetchHTML", async () => {
  const res = await fetchHTML(100);
  assert(typeof res === "string");
  assert(res.length > 0);
});

Deno.test("getNewBookList", () => {
  const decoder = new TextDecoder("utf-8");
  const bytes = Deno.readFileSync("tests/new_book.test.html");
  const res = getNewBookList(decoder.decode(bytes));
  assert(res[0].includes('<div class="detail-frame">'));
  assert(res[1].includes('<div class="detail-frame">'));
});
