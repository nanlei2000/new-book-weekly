import axios from 'axios';
import $ from 'cheerio';
// 新书速递
const newBookUrl = "https://book.douban.com/latest?icn=index-latestbook-all";
// 最受关注图书榜-非虚构
const hotNonFictionBookUrl = "https://book.douban.com/chart?subcat=I";
// 最受关注图书榜-虚构
const hotFictionBookUrl = "https://book.douban.com/chart?subcat=F";


async function getNewBookList() {
    const { data: resp } = await axios.get(newBookUrl);
    const $li = $(resp).find("#content > div > div.article > ul > li > div > h2 > a").each((index, ele) => {
        console.log(ele.childNodes[0].data);
    });
}

async function run() {
    await getNewBookList();
}

async function main() {
    await run();
}
main();
