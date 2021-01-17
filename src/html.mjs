import { fileURLToPath } from 'url';
import path from "path";
import fs from "fs";
import childProcess from 'child_process';
const SEP_TAG = "<!-- SEP-1511151742953336 -->";
const filePath = path.resolve(fileURLToPath(import.meta.url), "../../index.html");

function readHTML() {
  const html = fs.readFileSync(filePath, "utf-8").toString();
  return html;
}
// commit html then the online website will refresh
function commitChanges() {
  const commands = [
    'git pull origin master',
    'git add .',
    'git commit -m \'html change\'',
    'git push origin master',
  ];
  for (const cmd of commands) {
    childProcess.execSync(cmd);
  }
}

/**
 * @param str {string}
 * @param html {string}
 */
export function appendToHTML(str) {
  const html = readHTML();
  const [head, tail] = html.split(SEP_TAG);
  const modifiedHtml = [head, str + tail].join(SEP_TAG + "\n");
  fs.writeFileSync(filePath, modifiedHtml);
  commitChanges();
  return modifiedHtml;
}
