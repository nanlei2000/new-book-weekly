import { cheerio } from "https://deno.land/x/cheerio@1.0.4/mod.ts";
import dayjs from "https://cdn.skypack.dev/dayjs@1.10.4";

// import nodemailer from 'nodemailer'
// import fs from 'fs'
// import utils from 'util'
// import path from 'path'
// import schedule from 'node-schedule'
// import { appendToHTML } from './html.mjs'

// const isTesting = true
// const readFileP = utils.promisify(fs.readFile)

const newBookUrl = "https://book.douban.com/latest?icn=index-latestbook-all";

interface Config {
  auth: {
    user: string;
    pass: string;
  };
  to: string;
}

/**
 *
 * @param retryCount {number}
 */
async function fetchHTML(retryCount: number): Promise<string | void> {
  if (retryCount <= 0) {
    return console.log("Fail to fetch douban HTML");
  }
  const req = async () => {
    const raw = await fetch(newBookUrl);
    return raw.text();
  };

  try {
    console.log("Fetch douban HTML " + retryCount);
    return await req();
  } catch {
    await new Promise((r) => setTimeout(r, 2000));
    return fetchHTML(retryCount - 1);
  }
}

function getNewBookList(rawHtml: string): [string, string] {
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

// async function readConfig() {
//   const filePath = path.resolve(process.cwd(), './.env.json')
//   const jsonStr = (await readFileP(filePath)).toString()
//   return JSON.parse(jsonStr)
// }

// function makeTransporter(config) {
//   const user = config.auth.user //自己的邮箱
//   const pass = config.auth.pass //qq邮箱授权码
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.qq.com',
//     port: 587,
//     secure: false,
//     auth: {
//       user: user, // 用户账号
//       pass: pass //授权码,通过QQ获取
//     }
//   })
//   return transporter
// }

// async function sendMailAndWriteFile(config, transporter) {
//   const [mailHTML, fileHTML] = await getNewBookList()
//   await transporter.sendMail({
//     from: {
//       name: '一周新书推荐',
//       address: config.auth.user
//     }, // sender address
//     to: config.to, // list of receivers
//     subject: ['一周新书推荐', dayjs().format('YYYY-MM-DD')].join(' '), // Subject line
//     html: mailHTML
//   })

//   appendToHTML(fileHTML)
//   console.log('发送成功')
// }

// async function main() {
//   const config = await readConfig()
//   const transporter = makeTransporter(config)
//   const job = () => sendMailAndWriteFile(config, transporter)
//   // 每星期六早10点
//   schedule.scheduleJob('00 10 * * 6', job)
// }

// main()
