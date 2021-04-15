interface Config {
  auth: {
    user: string;
    pass: string;
  };
  to: string;
}

async function readConfig() {
  const filePath = path.resolve(process.cwd(), "./.env.json");
  const jsonStr = (await readFileP(filePath)).toString();
  return JSON.parse(jsonStr);
}

function makeTransporter(config) {
  const user = config.auth.user; //自己的邮箱
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

async function sendMailAndWriteFile(config, transporter) {
  const [mailHTML, fileHTML] = await getNewBookList();
  await transporter.sendMail({
    from: {
      name: "一周新书推荐",
      address: config.auth.user,
    }, // sender address
    to: config.to, // list of receivers
    subject: ["一周新书推荐", dayjs().format("YYYY-MM-DD")].join(" "), // Subject line
    html: mailHTML,
  });

  appendToHTML(fileHTML);
  console.log("发送成功");
}
