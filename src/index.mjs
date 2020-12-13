// @ts-check
import axios from 'axios';
import cheerio from 'cheerio';
import nodemailer from "nodemailer";
import fs from 'fs';
import utils from 'util';
import path from 'path';

const readFileP = utils.promisify(fs.readFile);

// 新书速递
const newBookUrl = "https://book.douban.com/latest?icn=index-latestbook-all";
// 最受关注图书榜-非虚构
const hotNonFictionBookUrl = "https://book.douban.com/chart?subcat=I";
// 最受关注图书榜-虚构
const hotFictionBookUrl = "https://book.douban.com/chart?subcat=F";


async function getNewBookList() {
    const { data: resp } = await axios.get(newBookUrl);
    let res = "<html>";

    res += "<h1>虚构类</h1><hr/>";
    let html$ = cheerio.load(resp);
    html$("a[class=cover]").remove();
    html$ = cheerio.load(html$.html());
    let html = html$('#content > div > div.article > ul');
    res += html;

    res += "<h1>非虚构类</h1><hr/>";
    html = html$('#content > div > div.aside > ul');
    res += html;
    res += "</html>";

    return res;
}
/**
 * @type {import('./index').ReadConfig}
 */
async function readConfig() {
    const filePath = path.resolve(process.cwd(), './.env.json');
    const jsonStr = (await readFileP(filePath)).toString();
    return JSON.parse(jsonStr);
}
/**
 * @description 发送邮件
 * @type {import('./index').SendMail}
 */
async function sendMail(html, config) {
    var user = config.auth.user;//自己的邮箱
    var pass = config.auth.pass; //qq邮箱授权码
    const transporter = nodemailer.createTransport({
        host: "smtp.qq.com",
        port: 587,
        secure: false,
        auth: {
            user: user, // 用户账号
            pass: pass, //授权码,通过QQ获取
        },
    });
    await transporter.sendMail({
        from: {
            name: "一周新书",
            address: config.auth.user
        }, // sender address
        to: config.to, // list of receivers
        subject: "一周新书", // Subject line
        html: html
    });
    console.log("发送成功");
}

async function run() {
    await getNewBookList();
}

async function main() {
    const html = await getNewBookList();
    const config = await readConfig();
    sendMail(html, config);
}
main();
