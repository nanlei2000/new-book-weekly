import { cheerio } from "https://deno.land/x/cheerio@1.0.4/mod.ts";
import dayjs from "https://cdn.skypack.dev/dayjs@1.10.4";
import * as log from "https://deno.land/std@0.93.0/log/mod.ts";
import { delay } from "https://deno.land/std@0.93.0/async/delay.ts";

const newBookUrl = "https://book.douban.com/latest?icn=index-latestbook-all";

export async function fetchHTML(
  retryCount: number,
): Promise<string | undefined> {
  if (retryCount <= 0) {
    return log.error("Fail to fetch douban HTML");
  }
  try {
    log.info("Fetch douban HTML " + retryCount);
    const raw = await fetch(newBookUrl);
    return raw.text();
  } catch (error) {
    log.warning(error);
    await delay(1000);
    return fetchHTML(retryCount - 1);
  }
}

export function getNewBookList(rawHtml: string): [string, string] {
  const dateStr = dayjs().format("YYYY-MM-DD");
  let mailHTML = "<html>";
  let fileHTML = "";

  mailHTML += "<h1>虚构类</h1><hr/>";
  fileHTML += `<h1>${dateStr}&nbsp虚构类</h1><hr/>`;

  let html$ = cheerio.load(rawHtml);
  html$("a[class=cover]").remove();
  html$ = cheerio.load(html$.html());

  let html = html$("#content > div > div.article > ul");
  mailHTML += html;
  fileHTML += html;

  mailHTML += "<h1>非虚构类</h1><hr/>";
  fileHTML += `<h1>${dateStr}&nbsp非虚构类</h1><hr/>`;

  html = html$("#content > div > div.aside > ul");
  mailHTML += html;
  fileHTML += html;

  mailHTML += "</html>";
  return [mailHTML, fileHTML] as [string, string];
}
