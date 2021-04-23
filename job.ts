import { fetchHTML, getNewBookList } from "./get.ts";
import { readConfig, sendMail } from "./send.ts";
import { appendToHTML, commitChanges } from "./store.ts";
import { readFile, writeFile } from "./utils.ts";
import { log } from "./dep.ts";
import { nil } from "./utils.ts";

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

  if (cfg!.notify) {
    await sendMail(cfg!, html.mailHTML);
  }
  if (cfg!.syncToRemote) {
    const old = readFile("index.html");
    const newHTML = appendToHTML(old, html.fileHTML);
    writeFile(newHTML, "www/index.html");
    commitChanges("html change");
  }
}
