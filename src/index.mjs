// @ts-check
import axios from 'axios';
import cheerio from 'cheerio';
import nodemailer from "nodemailer";
import fs from 'fs';
import utils from 'util';
import path from 'path';
import schedule from 'node-schedule';
import dayjs from 'dayjs';
import { appendToHTML } from './html.mjs';

const isTesting = true;
const readFileP = utils.promisify(fs.readFile);

// 新书速递
const newBookUrl = "https://book.douban.com/latest?icn=index-latestbook-all";
// 最受关注图书榜-非虚构
const hotNonFictionBookUrl = "https://book.douban.com/chart?subcat=I";
// 最受关注图书榜-虚构
const hotFictionBookUrl = "https://book.douban.com/chart?subcat=F";

/**
 * 
 * @param retryCount {number}
 */
async function fetchDoubanHTML(retryCount) {
  if (retryCount <= 0) {
    return console.log("Fail to fetch douban HTML");
  }
  const req = async () => {
    const { data: resp } = await axios.get(newBookUrl, {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "zh-CN,zh;q=0.9",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "cookie": "bid=nqfCgMsvbW0",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36"
      }
    });
    return resp;
  };

  try {
    console.log("Fetch douban HTML " + retryCount);
    return await req();
  } catch (error) {
    await new Promise((r) => setTimeout(r, 2000));
    return fetchDoubanHTML(retryCount - 1);
  }
}

/**
 * @returns {Promise<[string,string]>}
 */
async function getNewBookList() {
  const resp = await fetchDoubanHTML(500);
  const dateStr = dayjs().format('YYYY-MM-DD');
  let mailHTML = "<html>";
  let fileHTML = "";

  mailHTML += "<h1>虚构类</h1><hr/>";
  fileHTML += `<h1>${dateStr}&nbsp虚构类</h1><hr/>`;

  let html$ = cheerio.load(resp);
  html$("a[class=cover]").remove();
  html$ = cheerio.load(html$.html());
  let html = html$('#content > div > div.article > ul');
  mailHTML += html;
  fileHTML += html;

  mailHTML += "<h1>非虚构类</h1><hr/>";
  fileHTML += `<h1>${dateStr}&nbsp非虚构类</h1><hr/>`;
  html = html$('#content > div > div.aside > ul');
  mailHTML += html;
  fileHTML += html;
  mailHTML += "</html>";

  return [mailHTML, fileHTML];
}
/**
 * @type {import('./index').ReadConfig}
 */
async function readConfig() {
  const filePath = path.resolve(process.cwd(), './.env.json');
  const jsonStr = (await readFileP(filePath)).toString();
  return JSON.parse(jsonStr);
}

/** @param  config {import('./index').Config} */
function makeTransporter(config) {
  const user = config.auth.user;//自己的邮箱
  const pass = config.auth.pass; //qq邮箱授权码
  const transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 587,
    secure: false,
    auth: {
      user: user, // 用户账号
      pass: pass, //授权码,通过QQ获取
    },
  });
  return transporter;
}

/**
 * @description 发送邮件
 * @type {import('./index').SendMail}
 */
async function sendMailAndWriteFile(config, transporter) {
  const [mailHTML, fileHTML] = await getNewBookList();
  !isTesting && await transporter.sendMail({
    from: {
      name: "一周新书推荐",
      address: config.auth.user
    }, // sender address
    to: config.to, // list of receivers
    subject: ["一周新书推荐", dayjs().format('YYYY-MM-DD')].join(' '), // Subject line
    html: mailHTML
  });

  appendToHTML(fileHTML);
  console.log("发送成功");
}

async function main() {
  const config = await readConfig();
  const transporter = makeTransporter(config);
  sendMailAndWriteFile(config, transporter);
  const job = () => sendMailAndWriteFile(config, transporter);
  // 每星期六早10点
  schedule.scheduleJob("00 10 * * 6", job);
}

main();
