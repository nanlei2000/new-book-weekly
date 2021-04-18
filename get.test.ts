import { assert } from "./dep.ts";
import { fetchHTML, getNewBookList } from "./get.ts";
import { bookHTML } from "./tests/book_html.ts";

Deno.test("fetchHTML", async () => {
  const res = await fetchHTML(100);
  assert(typeof res === "string");
  assert(res.length > 0);
});

Deno.test("getNewBookList", () => {
  const res = getNewBookList(bookHTML);
  assert(res.fileHTML.includes('<div class="detail-frame">'));
  assert(res.mailHTML.includes('<div class="detail-frame">'));
});
