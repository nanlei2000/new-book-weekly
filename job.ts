import { fetchHTML, getNewBookList } from "./get.ts";
import { readConfig, sendMail } from "./send.ts";
import { appendToHTML, commitChanges, readHTML, writeHTML } from "./store.ts";
import * as log from "https://deno.land/std@0.93.0/log/mod.ts";
import { nil } from "./error.ts";

export async function doJob() {
  const [cfg, err] = readConfig(".env.json");
  if (err !== nil) {
    log.error(err);
    return;
  }
  const raw = await fetchHTML(10);
  if (!raw) {
    log.error("get new html failed");
    return;
  }
  const html = getNewBookList(raw);
  await sendMail(cfg!, html.mailHTML);

  if (cfg!.commitToGit) {
    const newHTML = appendToHTML(readHTML("index.html"), html.fileHTML);
    writeHTML(newHTML);
    commitChanges("html change");
  }
}
