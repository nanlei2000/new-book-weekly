import { fileURLToPath } from 'url';
import path from "path";
import fs from "fs";

const SEP_TAG = "<!-- SEP-1511151742953336 -->";
const filePath = path.resolve(fileURLToPath(import.meta.url), "../../index.html");

function readHTML() {
  const html = fs.readFileSync(filePath, "utf-8").toString();
  return html;
}

/**
 * 
 * @param str {string}
 * @param html {string}
 */
export function appendToHTML(str) {
  const html = readHTML();
  const [head, tail] = html.split(SEP_TAG);
  const modifiedHtml = [head, str + tail].join(SEP_TAG + "\n");
  fs.writeFileSync(filePath, modifiedHtml);
  return modifiedHtml;
}
