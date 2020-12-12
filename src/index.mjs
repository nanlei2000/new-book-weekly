// @ts-check
import axios from 'axios';
import $ from 'cheerio';
import nodemailer from "nodemailer";
import fs from 'fs';
import utils from 'util';
import path from 'path';

// 新书速递
const newBookUrl = "https://book.douban.com/latest?icn=index-latestbook-all";
// 最受关注图书榜-非虚构
const hotNonFictionBookUrl = "https://book.douban.com/chart?subcat=I";
// 最受关注图书榜-虚构
const hotFictionBookUrl = "https://book.douban.com/chart?subcat=F";


async function getNewBookList() {
    const { data: resp } = await axios.get(newBookUrl);
    let res = "<html>";
    const links = $(resp).find("#content > div > div.article > ul > li > div > h2 > a").each((index, ele) => {
        res += `<p><a href="${ele.attribs.href}">${ele.children[0].data}</a></p>`;
    });
    res += "</html>";
    return res;
}
/**
 * @type {import('./index').ReadConfig}
 */
async function readConfig() {
    const readFileP = utils.promisify(fs.readFile);
    const filePath = path.resolve(process.cwd(), './.env.json');
    const jsonStr = (await readFileP(filePath)).toString();
    return JSON.parse(jsonStr);
}
/**
 * @description 发送邮件函数
 * @type {import('./index').SendMail}
 */
async function sendMail(html, config) {
    var user = config.auth.user;//自己的邮箱
    var pass = config.auth.pass; //qq邮箱授权码
    let transporter = nodemailer.createTransport({
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
